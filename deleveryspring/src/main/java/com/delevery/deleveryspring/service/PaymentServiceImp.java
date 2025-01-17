package com.delevery.deleveryspring.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.reposetry.PaymentRespons;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class PaymentServiceImp implements PaymentService {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Override
    public PaymentRespons createPaymentLink(Order order) {

        // Set the Stripe secret key
        Stripe.apiKey = stripeSecretKey;

        // Build the session creation parameters
        SessionCreateParams params = SessionCreateParams.builder()
            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("http://localhost:3000/payment/success/" + order.getId())
            .setCancelUrl("http://localhost:3000/payment/fail")
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("usd")
                            .setUnitAmount((long) order.getTotalPrice() * 100) // amount in cents
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("zoth Food") // Correct product name
                                    .build()
                            )
                            .build()
                    )
                    .build()
            )
            .build();
// Créer la session avec les paramètres définis
            try {
               Session session = Session.create(params);

                // Retourner l'URL de paiement générée par Stripe
                PaymentRespons res = new PaymentRespons();
                res.setPayment_url(session.getUrl()); // Récupérer l'URL de paiement de la session
                return res;

            } catch (Exception e) {
                  e.printStackTrace(); // Pour un environnement de développement, afficher l'exception
                 // Il serait préférable de lancer une exception ou renvoyer une réponse d'erreur appropriée ici.
                 return null;
       }
    }
}