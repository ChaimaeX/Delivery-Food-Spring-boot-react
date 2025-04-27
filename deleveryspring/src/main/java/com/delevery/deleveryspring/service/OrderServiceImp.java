package com.delevery.deleveryspring.service;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.delevery.deleveryspring.Controller.AdminController;
import com.delevery.deleveryspring.Dto.MailBody;
import com.delevery.deleveryspring.Exception.OrderCalculationException;
import com.delevery.deleveryspring.Exception.OrderProcessing;
import com.delevery.deleveryspring.Model.Address;
import com.delevery.deleveryspring.Model.Cart;
import com.delevery.deleveryspring.Model.CartItem;
import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.Model.Orderitem;
import com.delevery.deleveryspring.Model.Restaurant;
import com.delevery.deleveryspring.Model.USER_ROLE;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.AdressRepos;
import com.delevery.deleveryspring.reposetry.OrderItemRepos;
import com.delevery.deleveryspring.reposetry.OrderRepos;
import com.delevery.deleveryspring.reposetry.UserRepos;
import com.delevery.deleveryspring.request.OrderRequest;

import lombok.extern.slf4j.Slf4j;

@Service
public class OrderServiceImp implements OrderService{

    


    @Autowired
    private OrderItemRepos orderItemRepos;

    @Autowired
    private OrderRepos orderRepos;

    @Autowired
    private AdressRepos adressRepos;

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImp.class);

    @Override
    public Order createOrder(OrderRequest order, User user, String jwt) throws Exception {
        // 1. Gestion de l'adresse optimisée
        Address savedAddress = processAddress(order.getDelivery(), user);
        
        // 2. Récupération du restaurant
        Restaurant restaurant = restaurantService.findRestaurantById(order.getRestaurantId());
        
        // 3. Création de la commande de base
        Order createdOrder = buildBaseOrder(user, savedAddress, restaurant);
        
        // 4. Traitement des articles en batch
        Cart cart = cartService.findCartByUserId(user.getId(), jwt);
        processOrderItems(cart, createdOrder);
        
        // 5. Calcul et sauvegarde
        calculateAndSaveOrderTotals(cart, createdOrder);
        
        // 6. Nettoyage et notification asynchrone
        completeOrderProcess(createdOrder, restaurant, user);
        
        return createdOrder;
    }

    private Address processAddress(Address shippingAddress, User user) {
        if (shippingAddress.getId() != null) {
            return adressRepos.findById(shippingAddress.getId())
                .map(existingAddress -> {
                    if (user.getAddresses().stream().noneMatch(addr -> addr.getId().equals(existingAddress.getId()))) {
                        user.getAddresses().add(existingAddress);
                        userRepos.save(user);
                    }
                    return existingAddress;
                })
                .orElseGet(() -> {
                    shippingAddress.setId(null);
                    return saveNewAddress(shippingAddress, user);
                });
        }
        return saveNewAddress(shippingAddress, user);
    }

    private Address saveNewAddress(Address address, User user) {
        Address savedAddress = adressRepos.save(address);
        user.getAddresses().add(savedAddress);
        userRepos.save(user);
        return savedAddress;
    }

    private Order buildBaseOrder(User user, Address address, Restaurant restaurant) {
        Order order = new Order();
        order.setCustomer(user);
        order.setCreatedAt(new Date());
        order.setOrderStatus("PENDING");
        order.setDeliveryAddress(address);
        order.setRestaurant(restaurant);
        order.setAccepted(false);
        order.setDeliveryPerson(null);
        return order;
    }

    private void processOrderItems(Cart cart, Order order) {
        List<Orderitem> orderItems = cart.getItem().stream()
            .map(cartItem -> {
                Orderitem orderitem = new Orderitem();
                orderitem.setFood(cartItem.getFood());
                orderitem.setIngredients(cartItem.getIngredients());
                orderitem.setQuantity(cartItem.getQuantity());
                orderitem.setTotalPrice(cartItem.getTotalPrice());
                return orderItemRepos.save(orderitem);
            })
            .collect(Collectors.toList());
        
        order.setItems(orderItems);
    }

    private void calculateAndSaveOrderTotals(Cart cart, Order order) {
        try {
            // 1. Calcul du total du panier
            Long totalPrice = cartService.calculateCartTotal(cart);
            
            if (totalPrice == null || totalPrice < 0) {
                throw new IllegalStateException("Le calcul du panier a retourné un montant invalide: " + totalPrice);
            }
    
            // 2. Application des frais de livraison
            Long deliveryFee = 10L; // 10 DH de frais fixes
            Long totalAmount = totalPrice + deliveryFee;
    
            // 3. Validation des totaux
            if (totalAmount <= totalPrice) {
                throw new IllegalStateException(
                    String.format("Erreur dans le calcul des totaux (total: %d, livraison: %d)", 
                    totalPrice, deliveryFee)
                );
            }
    
            // 4. Mise à jour de la commande
            order.setTotalPrice(totalPrice);
            order.setTotalAmount(totalAmount);
            
        } catch (Exception e) {
            log.error("Erreur lors du calcul des totals pour la commande", e);
            
            // Valeurs par défaut sécurisées
            order.setTotalPrice(0L);
            order.setTotalAmount(10L); // Frais de livraison minimum
            
            throw new OrderCalculationException(
                "Erreur lors du calcul des totaux. Valeurs par défaut appliquées", 
                e
            );
        }
    }
    private void completeOrderProcess(Order order, Restaurant restaurant, User user) {
        try {
            // 1. Sauvegarde synchrone de la commande
            Order savedOrder = orderRepos.save(order);
            restaurant.getOrders().add(savedOrder);
            
            // 2. Nettoyage SYNCHRONE du panier avant les opérations async
            try {
                cartService.cleanCart(user);
                log.info("Panier nettoyé avec succès pour l'utilisateur {}", user.getId());
            } catch (Exception e) {
                log.error("Échec critique du nettoyage du panier pour l'utilisateur {}", user.getId(), e);
                throw new OrderProcessing("Échec du nettoyage du panier", e);
            }
    
            // 3. Opérations asynchrones (seulement les notifications)
            CompletableFuture.runAsync(() -> {
                try {
                    notifyDeliveryPersons(savedOrder);
                } catch (Exception e) {
                    log.error("Échec de notification des livreurs", e);
                }
            });
    
        } catch (DataAccessException e) {
            log.error("Échec de persistance de la commande", e);
            throw new OrderProcessing("Erreur de base de données", e);
        } catch (Exception e) {
            log.error("Erreur inattendue", e);
            throw new OrderProcessing("Erreur de traitement", e);
        }
    } 
       
    @Async
    private void notifyDeliveryPersons(Order order) {
        userRepos.findByRole(USER_ROLE.ROLE_LIVREUR).stream()
            .filter(Objects::nonNull)
            .forEach(deliveryPerson -> {
                try {
                    emailService.sendSimpleEmail(MailBody.builder()
                        .to(deliveryPerson.getEmail())
                        .subject("Nouvelle commande à livrer")
                        .text(buildNotificationMessage(order))
                        .build());
                } catch (MailException e) {
                    log.error("Échec d'envoi de notification à {}", deliveryPerson.getEmail(), e);
                }
            });
    }
   private String buildNotificationMessage(Order order) {
    return String.format(
            "Nouvelle commande #%d\n" +
            "Restaurant: %s\n" +
            "Adresse: %s\n" +
            "Montant total: %d DH",
            order.getId(),
            order.getRestaurant().getName(),
            order.getDeliveryAddress().toString(),
            order.getTotalAmount() 
    );
   }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        if (orderStatus.equals("OUT_FOR_DELIVERY") 
            || orderStatus.equals("DELIVERED") 
            || orderStatus.equals("COMPLETED")
            || orderStatus.equals("PENDING")) {

            order.setOrderStatus(orderStatus);
            return orderRepos.save(order);
        }
        throw new Exception("PLEASE SELECT A VALID ORDER STATUS");
    }

    // @Override
    // public List<Order> filterOrder(Long restaurantId, String orderStatus) throws Exception {
        
    //         List<Order> orders = orderRepos.findByOrderStatusAndRestaurantId(orderStatus,restaurantId);
       
             
    //        return orders;
        
       
    // }

    @Override
    public void calcelOreder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);
        orderRepos.deleteById(orderId);
        throw new UnsupportedOperationException("Unimplemented method 'calculeOreder'");
    }

    @Override
    public List<Order> getUsersOrder(Long userId) throws Exception {
        
        List<Order> orders = orderRepos.findOrders(userId);
       
        orders.sort(Comparator.comparing(Order::getCreatedAt).reversed());
        
        return orders != null ? orders : Collections.emptyList();

    }

    @Override
    public List<Address> getUsersAddress(User user) throws Exception {
     List<Order> orders = getUsersOrder(user.getId());
    
     if (orders == null || orders.isEmpty()) {
        return Collections.emptyList();
     }
    
    return orders.stream()
            .map(Order::getDeliveryAddress)
            .filter(Objects::nonNull)
            .distinct()  // Élimine les doublons en utilisant equals() de Address
            .collect(Collectors.toList());
    }
    @Override
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) { 
    // Vérification des paramètres d'entrée
    if (restaurantId == null) {
        throw new IllegalArgumentException("Restaurant ID cannot be null");
    }

    // Récupération des commandes initiales
    List<Order> orders = orderRepos.findByRestaurantId(restaurantId);
    if (orderStatus == null || orderStatus.equalsIgnoreCase("ALL")) {
        orders = orderRepos.findByRestaurantId(restaurantId);
    }
    
    // Filtrage si un statut est spécifié
    if (orderStatus != null && !orderStatus.isEmpty()) {
        orders = orders.stream()
            .filter(order -> orderStatus.equalsIgnoreCase(order.getOrderStatus()))
            .collect(Collectors.toList());
    }

    
    
    // Tri par date de commande (du plus récent au plus ancien)
     orders.sort(Comparator.comparing(Order::getCreatedAt).reversed());
    
     return orders;
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder=orderRepos.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new Exception("order not found ");
        }

        return optionalOrder.get();
    }

    @Override
    public List<Order> findAllOrder() throws Exception {
        List<Order> orders =orderRepos.findAll();
       
        return orders != null ? orders : Collections.emptyList();
    }
  
    @Override
     public void deleteAddress(Long id) throws Exception {
        Optional<Address> addressOptional = adressRepos.findById(id);
    
        if (!addressOptional.isPresent()) {
            throw new Exception("Address with ID " + id + " not found");
        }
        
        Address address = addressOptional.get();
        address.setDeleted(true);
        adressRepos.save(address);
    
    
    }

    @Override
    public Order assignDeliveryPerson(Long orderId, User deliveryPerson) throws Exception {
        Order order = orderRepos.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        // Validation du rôle
         if (!USER_ROLE.ROLE_LIVREUR.equals(deliveryPerson.getRole())) {
             throw new RuntimeException("User " + deliveryPerson.getFullName() + " (ID: " + 
                 deliveryPerson.getId() + ") is not a delivery person");
         }
    
         // Validation de l'état de la commande
         if (order.getAccepted()) {
             throw new IllegalStateException("Order " + orderId + " is already assigned to " + 
                 (order.getDeliveryPerson() != null ? order.getDeliveryPerson().getFullName() : "another delivery person"));
         }
        
        order.setDeliveryPerson(deliveryPerson);
        order.setAccepted(true);
        
        return orderRepos.save(order);
    }

    @Override
    public List<Order> getOrderByDeliveryPerson(User deliveryPerson) throws Exception {
        
        if (!USER_ROLE.ROLE_LIVREUR.equals(deliveryPerson.getRole())) {
            throw new RuntimeException("User " + deliveryPerson.getFullName() + " (ID: " + 
                deliveryPerson.getId() + ") is not a delivery person");
        }

        List<Order> orders = orderRepos.findByDeliveryPerson(deliveryPerson);

        orders.sort(Comparator.comparing(Order::getCreatedAt).reversed());
        
        return orders;
    }

    @Override
    public List<Order> findOrderStatus(boolean status) {
    List<Order> orders = orderRepos.findByAccepted(status); 
    
    // Trier par date de création décroissante (du plus récent au plus ancien)
    orders.sort(Comparator.comparing(Order::getCreatedAt).reversed());
    
    return orders;
    }



}