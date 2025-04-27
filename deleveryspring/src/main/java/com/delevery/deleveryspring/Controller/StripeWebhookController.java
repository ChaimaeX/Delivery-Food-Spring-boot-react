// package com.delevery.deleveryspring.Controller;

// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestHeader;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.delevery.deleveryspring.service.PaymentService;
// import com.stripe.exception.SignatureVerificationException;
// import com.stripe.net.Webhook;
// import com.stripe.model.Event;
// import com.stripe.model.checkout.Session;
// import org.springframework.beans.factory.annotation.Value;
// import com.google.gson.Gson;
// import com.stripe.model.Event;
    
  

// @RestController
// @RequestMapping("/stripe/webhook")
// public class StripeWebhookController {

//     @Value("${stripe.webhook.secret}")
//     private String stripeWebhookSecret;

//     private final PaymentService paymentService;

//     public StripeWebhookController(PaymentService paymentService) {
//         this.paymentService = paymentService;
//     }

//       @PostMapping
//     public String handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
//         try {
//             // Désactiver la vérification de la signature pour les tests
//             Gson gson = new Gson();
//             Event event = gson.fromJson(payload, Event.class);
    
//             // Traiter l'événement
//             if ("checkout.session.completed".equals(event.getType())) {
//                 Session session = (Session) event.getDataObjectDeserializer().getObject().orElseThrow(() -> new RuntimeException("Session non trouvée"));
//                 String orderId = session.getMetadata().get("order_id"); // Récupérer l'ID de la commande
//                 long amount = session.getAmountTotal(); // Montant total en cents
//                 String restaurantStripeAccountId = session.getMetadata().get("restaurant_stripe_account_id"); // ID Stripe du restaurant
    
//                 // Transférer les fonds au restaurant
//                 paymentService.transferToRestaurant(restaurantStripeAccountId, amount / 100); // Convertir en dollars
//             }
    
//             return "Webhook reçu avec succès";
//         } catch (Exception e) {
//             throw new RuntimeException("Erreur lors du traitement du webhook", e);
//         }
//     }
// }
    
