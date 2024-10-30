package com.example.llmn.core.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.IOException;

public class LogDataParser {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String formatMessage(String messageJson) {
        try {
            JsonNode rootNode = objectMapper.readTree(messageJson);

            return objectMapper.writeValueAsString(rootNode);
        } catch (IOException e) {
            e.printStackTrace();
            return messageJson;  
        }
    }
}