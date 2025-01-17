package com.delevery.deleveryspring.config;

import java.io.IOException;
import java.util.List;

import javax.crypto.SecretKey;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenValidator extends OncePerRequestFilter {

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

    // استرجاع رمز JWT من العنوان
    String jwt = request.getHeader(JwtConstant.JWT_HEADER);

    if (jwt != null && !jwt.isEmpty()) {
        // التحقق من أن الرمز يبدأ بـ "Bearer "
        if (!jwt.startsWith("Bearer ")) {
            throw new BadCredentialsException("Invalid token format. Expected 'Bearer <token>'.");
        }

        // إزالة "Bearer " من بداية الرمز
        jwt = jwt.substring(7);

        // التحقق من عدد النقاط في الرمز
        if (jwt.split("\\.").length != 3) {
            throw new BadCredentialsException("Invalid JWT token: JWT strings must contain exactly 2 period characters.");
        }

        try {
            // فك الشيفرة والتحقق من الرمز
            SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
            Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();

            // استخراج المعلومات من الرمز
            String email = String.valueOf(claims.get("email"));
            String authorities = String.valueOf(claims.get("authorities"));

            System.err.println("authorities:"+authorities);
            // معالجة الصلاحيات
            List<GrantedAuthority> auth = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

            // إنشاء كائن المصادقة
            Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auth);

            // إضافة المصادقة إلى السياق الأمني
            SecurityContextHolder.getContext().setAuthentication(authentication);

        } catch (Exception e) {
            // معالجة الأخطاء أثناء التحقق من الرمز
            throw new BadCredentialsException("Invalid JWT token: " + e.getMessage());
        }
    }

    // متابعة معالجة الطلب
    filterChain.doFilter(request, response);
}

}
