package com.example.llmn.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebSocketHandlerConfig {

    @Bean
    public RedisWebSocketHandler redisWebSocketHandler() {
        return new RedisWebSocketHandler();
    }
}