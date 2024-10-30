package com.example.llmn.service;

import com.example.llmn.controller.DTO.LogDTO;
import com.example.llmn.controller.DTO.MetricResponse;
import com.example.llmn.domain.*;
import com.example.llmn.repository.ProjectRepository;
import com.example.llmn.repository.SummaryRepository;
import com.example.llmn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LlmService {

    private final LogService logService;
    private final MetricService metricService;
    private final AlarmService alarmService;
    private final UserRepository userRepository;
    private final SummaryRepository summaryRepository;
    private final ProjectRepository projectRepository;
    private final WebClient webClient;

    // 비공개
}