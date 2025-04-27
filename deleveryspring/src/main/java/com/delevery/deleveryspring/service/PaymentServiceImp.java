package com.delevery.deleveryspring.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
// import javax.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.delevery.deleveryspring.Model.Order;
import com.delevery.deleveryspring.reposetry.PaymentRespons;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.Transfer;
import com.stripe.model.checkout.Session;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.TransferCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class PaymentServiceImp implements PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImp.class);
    private static final long CENTS_MULTIPLIER = 100L;

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    // @PostConstruct
    // public void init() {
    //     Stripe.apiKey = stripeSecretKey;
    // }

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
    @Override
    public String createConnectedAccount(String email) {
        Stripe.apiKey = stripeSecretKey;
        try {
            AccountCreateParams params = AccountCreateParams.builder()
                .setType(AccountCreateParams.Type.EXPRESS)
                .setCountry("MA")
                .setEmail(email)
                .setCapabilities(
                    AccountCreateParams.Capabilities.builder()
                        .setCardPayments(AccountCreateParams.Capabilities.CardPayments.builder()
                            .setRequested(true)
                            .build())
                        .setTransfers(AccountCreateParams.Capabilities.Transfers.builder()
                            .setRequested(true)
                            .build())
                        .build())
                .setBusinessType(AccountCreateParams.BusinessType.INDIVIDUAL)
                .setBusinessProfile(
                    AccountCreateParams.BusinessProfile.builder()
                        .setProductDescription("Restaurant food delivery")
                        .build())
                .build();

            Account account = Account.create(params);
            return account.getId();
        } catch (StripeException e) {
            logger.error("Error creating connected account: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create connected account", e);
        }
    }

    @Override
    public String createOnboardingLink(String restaurantStripeAccountId) {
        Stripe.apiKey = stripeSecretKey;
        try {
            AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                .setAccount(restaurantStripeAccountId)
                .setRefreshUrl("http://localhost:3000/dashboard")
                .setReturnUrl("http://localhost:3000/fail")
                .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                .build();

            AccountLink accountLink = AccountLink.create(params);
            return accountLink.getUrl();
        } catch (StripeException e) {
            logger.error("Error creating onboarding link: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create onboarding link", e);
        }
    }

    @Override
    public String transferToRestaurant(String restaurantStripeAccountId, long amount) {
        Stripe.apiKey = stripeSecretKey;
        try {
            TransferCreateParams params = TransferCreateParams.builder()
                .setAmount(10 * CENTS_MULTIPLIER)
                .setCurrency("usd")
                .setDestination(restaurantStripeAccountId)
                .build();

            Transfer transfer = Transfer.create(params);
            return transfer.getId();
        } catch (StripeException e) {
            logger.error("Error transferring funds: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to transfer funds", e);
        }
    }
}