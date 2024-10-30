package com.example.llmn.service;

import com.example.llmn.core.errors.CustomException;
import com.example.llmn.core.errors.ExceptionCode;
import com.example.llmn.domain.Project;
import com.example.llmn.domain.SshInfo;
import com.example.llmn.repository.ProjectRepository;
import com.example.llmn.repository.SshInfoRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DockerService {

    private final SSHService sshService;
    private final RedisService redisService;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;

    private static final String RESOURCE_KEY = "resource";
    public static final String DOCKER_RESOURCE_KEY_CPU = "CPU";
    public static final String DOCKER_RESOURCE_KEY_MEMORY = "Memory";
    public static final String COMMAND_DOCKER_STOP = "docker stop ";
    public static final String COMMAND_DOCKER_RESTART = "docker restart ";
    public static final String COMMAND_DOCKER_PS = "docker ps --format \"{{.Names}}\"";
    public static final String COMMAND_DOCKER_STATS = "docker stats --no-stream --format \"{{.Name}}:{{.CPUPerc}}:{{.MemUsage}}\"";
    private static final Long RESOURCE_EXP = 10 * 60 * 1000L; 
    private static final String BLANK_STRING = "";

    public boolean stopContainerByName(String containerName, Long projectId) {
        Long sshInfoId = projectRepository.findSshInfoId(projectId).orElseThrow(
                () -> new CustomException(ExceptionCode.PROJECT_NOT_FOUND)
        );

        String command = COMMAND_DOCKER_STOP + containerName;
        String commandResponse = sshService.executeCommandOnce(command, sshInfoId);

        if(commandResponse.isBlank()){
            return false;
        }

        return commandResponse.trim().equals(containerName); 
    }

    public boolean restartContainerByName(String containerName, Long projectId) {
        Long sshInfoId = projectRepository.findSshInfoId(projectId).orElseThrow(
                () -> new CustomException(ExceptionCode.PROJECT_NOT_FOUND)
        );

        String command = COMMAND_DOCKER_RESTART + containerName;
        String commandResponse = sshService.executeCommandOnce(command, sshInfoId);

        if(commandResponse.isBlank()){
            return false;
        }

        return commandResponse.trim().equals(containerName);
    }

    public List<String> findRunningContainerList(Long sshId) {
        return Arrays.stream(sshService.executeCommandOnce(COMMAND_DOCKER_PS, sshId).split("\n"))
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .toList();
    }

    public boolean isContainerRunning(String containerName, Long sshId) {
        List<String> containerList = findRunningContainerList(sshId);

        return containerList.stream()
                .anyMatch(name -> name.equals(containerName));
    }

    public Map<String, Map<String, String>> findContainersResourceUsage(List<Project> projects, Long userId, boolean isUsingCache) {
        Map<String, Map<String, String>> cachedUsage = isUsingCache ? getCachedResourceUsage(userId) : null;
        if (cachedUsage != null) {
            return cachedUsage;
        }

        List<SshInfo> sshInfos = projects.stream()
                .map(Project::getSshInfo)
                .distinct()
                .toList();

        Map<String, Map<String, String>> containerUsageMap = new HashMap<>();
        for(SshInfo sshInfo : sshInfos){
            String commandResponse = sshService.executeCommandOnce(COMMAND_DOCKER_STATS, sshInfo.getId());
            Map<String, Map<String, String>> parsedMap = parseCommandResponse(commandResponse);

            containerUsageMap.putAll(parsedMap);
        }

        String value = convertMetricMapToString(containerUsageMap);
        if(!value.isBlank()){
            redisService.storeValue(RESOURCE_KEY, userId.toString(), value, RESOURCE_EXP);
        }

        return containerUsageMap;
    }

    private Map<String, Map<String, String>> getCachedResourceUsage(Long userId) {
        String cachedValue = redisService.getDataInStr(RESOURCE_KEY, userId.toString());

        if (cachedValue == null) {
            return null;
        }

        return convertStringToMetricMap(cachedValue);
    }

    private Map<String, Map<String, String>> convertStringToMetricMap(String cachedValue) {
        try {
            return objectMapper.readValue(cachedValue, new TypeReference<Map<String, Map<String, String>>>() {});
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    private Map<String, Map<String, String>> parseCommandResponse(String commandResponse) {
        Map<String, Map<String, String>> containerUsageMap = new HashMap<>();

        String[] lines = commandResponse.split("\n");

        for (String line : lines) {
            String[] parts = line.split(":");

            if (parts.length == 3) {
                String containerName = parts[0].trim();
                String cpuUsage = parts[1].trim();
                String memUsage = parts[2].trim();

                Map<String, String> resourceUsageMap = new HashMap<>();
                resourceUsageMap.put(DOCKER_RESOURCE_KEY_CPU, cpuUsage);
                resourceUsageMap.put(DOCKER_RESOURCE_KEY_MEMORY, memUsage);

                containerUsageMap.put(containerName, resourceUsageMap);
            }
        }
        return containerUsageMap;
    }

    private String convertMetricMapToString(Map<String, Map<String, String>> metricMap){
        try {
            return objectMapper.writeValueAsString(metricMap);
        } catch (JsonProcessingException e) {
            log.info("MetricMap 파싱 실패");
            return BLANK_STRING;
        }
    }
}
