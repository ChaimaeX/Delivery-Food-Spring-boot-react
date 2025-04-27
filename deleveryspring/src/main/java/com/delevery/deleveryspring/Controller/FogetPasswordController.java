package com.delevery.deleveryspring.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.delevery.deleveryspring.Dto.MailBody;
import com.delevery.deleveryspring.Model.FogetPassword;
import com.delevery.deleveryspring.Model.User;
import com.delevery.deleveryspring.reposetry.ForgetPasswordRepos;
import com.delevery.deleveryspring.reposetry.UserRepos;
import com.delevery.deleveryspring.request.ChangePasswordRequest;
import com.delevery.deleveryspring.service.EmailService;

import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/auth/forgetPassword")
public class FogetPasswordController {

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ForgetPasswordRepos forgetPasswordRepos;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // send mail form email verfication
    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        User user = userRepos.findByEmail(email);
                    //  .orElseThrow(() -> new UsernameNotFoundException("please provide an valid email !"+email));

        int otp = otpGenerator();
        MailBody mailBody = MailBody.builder()
           .to(email)
           .text("this is th OTP for your Forget Password request :"+otp)
           .subject("OTP for Forget Password request")
           .build();
        
        FogetPassword fp = FogetPassword.builder()
                 .otp(otp)
                 .expirationTime(new Date(System.currentTimeMillis() +70*1000))
                 .user(user)
                 .build();
        
        emailService.sendSimpleEmail(mailBody);
        forgetPasswordRepos.save(fp);
        return ResponseEntity.ok("Email sent for verification");
    }

    // verifier le otp  cad le code qui envoiyer a l email
    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<String> verifyOtp(@PathVariable Integer otp,
                                            @PathVariable String email){

                    User user = userRepos.findByEmail(email);
                            //    .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email!"+email));

            FogetPassword fp =  forgetPasswordRepos.findByOtpAndUser(otp,user).orElseThrow(()-> new RuntimeException("Invalid OTP for email: " +email));

            if (fp.getExpirationTime().before(Date.from(Instant.now()))) {
                forgetPasswordRepos.deleteById(fp.getFpid());
                  return new ResponseEntity<>("OTP has expired",HttpStatus.EXPECTATION_FAILED);
            }

            return ResponseEntity.ok("OTP verified");

                           
    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePassword(@PathVariable String email,
                                            @RequestBody ChangePasswordRequest changePassword) {
        // Input validation
        if (changePassword.newPassword() == null || changePassword.confirmPassword() == null) {
            return ResponseEntity.badRequest().body("Password fields cannot be null");
        }
        
        if (!changePassword.newPassword().equals(changePassword.confirmPassword())) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
                .body("Passwords do not match");
        }
        
        // Check user exists
        User user = userRepos.findByEmail(email);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        try {
            // Update password
            String encodedPassword = passwordEncoder.encode(changePassword.newPassword());
            userRepos.updatePassword(email, encodedPassword);
            
            // Clean up OTP
            user.setForgetPassword(null);
            userRepos.save(user);
            
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Failed to update password: " + e.getMessage());
        }
    }
    private Integer otpGenerator(){

        Random random = new Random();
        return random.nextInt(100_00,999_00);
    }


    
}
