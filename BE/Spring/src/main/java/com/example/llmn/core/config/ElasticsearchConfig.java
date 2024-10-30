package com.example.llmn.core.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Configuration
public class ElasticsearchConfig {

    private final Map<String, ElasticsearchClient> clientCache = new ConcurrentHashMap<>();
    private static final String HTTP_PROTOCOL = "http";


    public ElasticsearchClient createElasticsearchClient(String host) {
        return clientCache.computeIfAbsent(host, h -> {
            RestClient restClient = RestClient.builder(new HttpHost(h, 9200, HTTP_PROTOCOL)).build();
            ElasticsearchTransport transport = new RestClientTransport(restClient, new JacksonJsonpMapper());
            return new ElasticsearchClient(transport);
        });
    }
}
