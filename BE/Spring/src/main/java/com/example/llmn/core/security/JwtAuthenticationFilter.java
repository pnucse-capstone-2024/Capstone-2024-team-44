package com.example.llmn.core.security;

import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.llmn.core.utils.CookieUtils;
import com.example.llmn.domain.User;
import com.example.llmn.service.RedisService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
public class JwtAuthenticationFilter extends BasicAuthenticationFilter {

    private final RedisService redisService;
    private static final String REDIS_KEY_REFRESH_TOKEN = "refreshToken";
    private static final String REDIS_KEY_ACCESS_TOKEN = "accessToken";
    public static final String REFRESH_TOKEN_COOKIE_KEY = "refreshToken";
    public static final String ACCESS_TOKEN_COOKIE_KEY = "accessToken";

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, RedisService redisService) {
        super(authenticationManager);
        this.redisService = redisService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String authorizationHeader = request.getHeader(JWTProvider.AUTHORIZATION);
        String accessToken = (authorizationHeader != null && authorizationHeader.startsWith(JWTProvider.TOKEN_PREFIX)) ?
                authorizationHeader.replace(JWTProvider.TOKEN_PREFIX, "") : null;

        String refreshToken = CookieUtils.getCookieFromRequest(REFRESH_TOKEN_COOKIE_KEY, request);

        if (checkIsTokenEmpty(accessToken, refreshToken)){
            chain.doFilter(request, response);
            return;
        }

        User user = authenticateAccessToken(accessToken);

        if (user == null) {
            user = authenticateRefreshToken(refreshToken);
        }

        if (user == null) {
            chain.doFilter(request, response);
            return;
        }

        authenticateUser(user);
        
        redisService.addSetElement(createVisitKey(), user.getId());

        CookieUtils.syncHttpResponseCookiesFromHttpRequest(request, response, ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY);
        response.setHeader(HttpHeaders.AUTHORIZATION, JWTProvider.TOKEN_PREFIX + accessToken);

        chain.doFilter(request, response);
    }

    private void authenticateUser(User user) {
        CustomUserDetails myUserDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                myUserDetails,
                myUserDetails.getPassword(),
                myUserDetails.getAuthorities()
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private User getUserFromToken(String token) {
        try {
            DecodedJWT decodedJWT = JWTProvider.verify(token);
            Long id = decodedJWT.getClaim("id").asLong();
            String nickName = decodedJWT.getClaim("nickName").asString();
            return User.builder().id(id).nickName(nickName).build();
        } catch (SignatureVerificationException sve) {
            log.error("토큰 검증 실패");
        } catch (TokenExpiredException tee) {
            log.error("토큰 만료됨");
        } catch (JWTDecodeException jde) {
            log.error("잘못된 형태의 토큰값이 입력으로 들어와서 디코딩 실패");
        }
        return null;
    }

    private String createVisitKey() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH");

        return "visit" + ":" + now.format(formatter);
    }

    private boolean checkIsTokenEmpty(String accessToken, String refreshToken) {
        return (accessToken == null || accessToken.trim().isEmpty()) && (refreshToken == null || refreshToken.trim().isEmpty());
    }

    private User authenticateAccessToken(String accessToken) {
        if (accessToken != null) {
            return getUserFromToken(accessToken);
        }
        return null;
    }

    private User authenticateRefreshToken(String refreshToken) {
        if (refreshToken != null) {
            User user = getUserFromToken(refreshToken);

            if (user != null && redisService.validateData(REDIS_KEY_REFRESH_TOKEN, String.valueOf(user.getId()), refreshToken)) {
                return user;
            }
        }
        return null;
    }

    private void updateToken(User user, String accessToken, String refreshToken){
        // 리프레쉬 토큰 갱신
        redisService.storeValue(REDIS_KEY_REFRESH_TOKEN, String.valueOf(user.getId()), refreshToken, JWTProvider.REFRESH_EXP_MILLI);

        // 엑세스 토큰 갱신
        redisService.storeValue(REDIS_KEY_ACCESS_TOKEN, String.valueOf(user.getId()), accessToken, JWTProvider.ACCESS_EXP_MILLI);
    }
}