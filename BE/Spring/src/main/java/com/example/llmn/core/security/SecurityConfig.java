package com.example.llmn.core.security;

import com.example.llmn.core.errors.CustomException;
import com.example.llmn.core.utils.FilterResponseUtils;
import com.example.llmn.core.errors.ExceptionCode;
import com.example.llmn.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final RedisService redisService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class).build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)

                .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                .exceptionHandling(exceptionHandling -> {
                    exceptionHandling.authenticationEntryPoint((request, response, authException) ->
                            FilterResponseUtils.unAuthorized(response, new CustomException(ExceptionCode.USER_UNAUTHORIZED))
                    );
                    exceptionHandling.accessDeniedHandler((request, response, accessDeniedException) ->
                            FilterResponseUtils.forbidden(response, new CustomException(ExceptionCode.USER_FORBIDDEN))
                    );
                })

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/accounts/profile", "/api/accounts/password/**", "/api/accounts/role", "/api/accounts/info").authenticated()
                        .requestMatchers("/ws/**", "/api/test",  "/api/log","/api/container", "/api/metrics", "/api/auth/**", "/api/accounts/**", "/api/validate/accessToken", "/api/log").permitAll()
                        .anyRequest().authenticated()
                )

                .addFilter(new JwtAuthenticationFilter(authenticationManager(http), redisService));

        return http.build();
    }

    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedOriginPattern("*");
        configuration.setAllowCredentials(true);
        configuration.addExposedHeader("Authorization");
        configuration.setExposedHeaders(Arrays.asList("accessToken", "refreshToken"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
