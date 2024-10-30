package com.example.llmn.service;

import com.example.llmn.controller.DTO.SshInfoDTO;
import com.example.llmn.core.errors.CustomException;
import com.example.llmn.core.errors.ExceptionCode;
import com.example.llmn.core.utils.SSHCommandExecutor;
import com.example.llmn.domain.SshInfo;
import com.example.llmn.repository.SshInfoRepository;
import com.example.llmn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class SSHService {

    private final RedisService redisService;
    private final UserRepository userRepository;
    private final SshInfoRepository sshInfoRepository;

    // 비공개
}