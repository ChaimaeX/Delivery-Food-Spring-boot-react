package com.delevery.deleveryspring.mailing;

import org.springframework.web.util.UriComponentsBuilder;
import com.delevery.deleveryspring.Model.User;
import java.util.Objects;

public class AccountVerificationEmailContext extends AbstractEmailContext {  // Assuming it extends a base email context

    private String token;

    @Override
    public <T> void init(T context) {
        if (!(context instanceof User)) {
            throw new IllegalArgumentException("Context must be an instance of User");
        }

        User user = (User) context;
        validateUserEmail(user.getEmail());

        // Set email properties
        put("fullName", user.getFullName());
        setTemplateLocation("mailing/email-verification");
        setSubject("Complete Your Registration");
        setFrom("aharakchaimae1212@gmail.com");
        setTo(user.getEmail());
    }

    public void setToken(String token) {
        this.token = Objects.requireNonNull(token, "Token cannot be null");
        put("token", token);
    }

    public String buildVerificationUrl(final String baseURL, final String token) {
        Objects.requireNonNull(baseURL, "Base URL cannot be null");
        Objects.requireNonNull(token, "Token cannot be null");

        final String url = UriComponentsBuilder.fromHttpUrl(baseURL)
                .path("/account/login")
                .queryParam("token", token)
                .toUriString();

        put("verificationURL", url);
        return url;  // Return the URL in case it's needed elsewhere
    }

    private void validateUserEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("User email cannot be null or empty");
        }
        // Add basic email format validation if needed
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }
}