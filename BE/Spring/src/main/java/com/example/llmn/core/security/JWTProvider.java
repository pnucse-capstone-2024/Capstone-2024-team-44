package com.example.llmn.core.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.llmn.domain.User;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTProvider {

    public static final Long ACCESS_EXP_MILLI = 1000L * 60 * 60 * 24; 
    public static final Long REFRESH_EXP_MILLI = 1000L * 60 * 60 * 24 * 7; 

    public static final Long ACCESS_EXP_SEC = 60L * 60 * 24; 
    public static final Long REFRESH_EXP_SEC = 60L * 60 * 24 * 7; 

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String AUTHORIZATION = "Authorization";
    public static final String SECRET = "MySecretKey";


    public static String createAccessToken(User user) {
        String jwt = create(user, ACCESS_EXP_MILLI);
        return jwt;
    }

    public static String createRefreshToken(User user) {
        String jwt = create(user, REFRESH_EXP_MILLI);
        return jwt;
    }

    public static String create(User user, Long exp) {
        String jwt = JWT.create()
                .withSubject(user.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + exp))
                .withClaim("id", user.getId())
                .withClaim("nickName", user.getNickName())
                .sign(Algorithm.HMAC512(SECRET));
        return jwt;
    }

    public static DecodedJWT verify(String jwt) throws SignatureVerificationException, TokenExpiredException {
        jwt = jwt.replace(JWTProvider.TOKEN_PREFIX, "");
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(SECRET))
                .build().verify(jwt);
        return decodedJWT;
    }

    public static Long getUserIdFromToken(String token) {
        DecodedJWT decodedJWT = verify(token);
        return decodedJWT.getClaim("id").asLong();
    }

    public static boolean validateToken(String token) {
        try {
            token = token.replace(JWTProvider.TOKEN_PREFIX, "");
            JWT.require(Algorithm.HMAC512(SECRET)).build().verify(token);
            return true;
        } catch (JWTVerificationException exception) { 
            return false;
        }
    }
}
