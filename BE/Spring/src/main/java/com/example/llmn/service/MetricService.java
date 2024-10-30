package com.example.llmn.service;

import com.example.llmn.controller.DTO.MetricResponse;
import com.example.llmn.domain.Metric;

import com.example.llmn.domain.SshInfo;
import com.example.llmn.repository.MetricRepository;
import com.example.llmn.repository.SshInfoRepository;
import com.example.llmn.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricService {

    private final MetricRepository metricRepository;
    private final UserRepository userRepository;
    private final SshInfoRepository sshInfoRepository;
    private final RedisService redisService;
    private final SSHService sshService;
    private final ObjectMapper objectMapper;

    private static final String REDIS_KEY_NETWORK_REC = "network:received";
    private static final String REDIS_KEY_NETWORK_TRANS = "network:transmitted";
    private static final String METRIC_KEY = "metric";
    private static final Long METRIC_EXP = 10 * 60 * 1000L; // 10분
    private static final boolean UPDATE_CACHE = true;
    private static final boolean NOT_UPDATE_CACHE = false;
    private static final String METRIC_MAP_CPU_USAGE = "cpuUsage";
    private static final String METRIC_MAP_TOTAL_MEMORY = "totalMemory";
    private static final String METRIC_MAP_USED_MEMORY = "usedMemory";
    private static final String METRIC_MAP_NETWORK_REC = "networkReceived";
    private static final String METRIC_MAP_NETWORK_SENT ="networkSent";
    private static final String METRIC_MAP_DAILY_NET_REC = "dailyReceived";
    private static final String METRIC_MAP_DAILY_NET_SENT ="dailySent";
    private static final String COMMAND_TOP = "top -b -n1 | grep \"Cpu(s)\\|Mem\"";
    private static final String COMMAND_NETWORK_USAGE = "cat /proc/net/dev";
    private static final DateTimeFormatter formatterForHourAndMin = DateTimeFormatter.ofPattern("HH:mm"); // 시간 형식 "HH:mm"
    private static final Pattern CPU_PATTERN = Pattern.compile("%Cpu\\(s\\):\\s+([\\d.]+)\\s+us,\\s+([\\d.]+)\\s+sy,.*");
    private static final Pattern MEM_PATTERN = Pattern.compile("MiB Mem :\\s+([\\d.]+)\\s+total,\\s+([\\d.]+)\\s+free,\\s+([\\d.]+)\\s+used,.*");

    @Scheduled(cron = "0 0/10 * * * *")
    @Transactional
    public void collectMetrics() {
        List<Long> userIds = userRepository.findIds();

        for(Long userId : userIds){
            List<SshInfo> sshInfos = sshInfoRepository.findByUserId(userId);
            Long monitoringSshId = userRepository.findMonitoringSshId(userId).get();

            for(SshInfo sshInfo : sshInfos){
                Map<String, Double> topMetrics = collectTopMetrics(sshInfo.getId());

                boolean updateCache = sshInfo.getId().equals(monitoringSshId);
                Map<String, Double> networkMetrics = collectNetworkMetrics(sshInfo.getId(), updateCache);

                if(topMetrics.isEmpty() || networkMetrics.isEmpty()){
                    continue;
                }

                Metric metric = Metric.builder()
                        .sshInfo(sshInfo)
                        .cpuUsage(topMetrics.get(METRIC_MAP_CPU_USAGE))
                        .totalMemory(topMetrics.get(METRIC_MAP_TOTAL_MEMORY))
                        .usedMemory(topMetrics.get(METRIC_MAP_USED_MEMORY))
                        .totalBytesReceived(networkMetrics.get(METRIC_MAP_NETWORK_REC)) // 10분 간격의 네트워크 트래픽
                        .totalBytesSent(networkMetrics.get(METRIC_MAP_NETWORK_SENT))
                        .build();

                metricRepository.save(metric);
            }
        }
    }

    public MetricResponse.FindCurrentMetricDTO findCurrentMetric(Long sshInfoId) {
        MetricResponse.FindCurrentMetricDTO cachedMetric = getCachedMetric(sshInfoId);
        if (cachedMetric != null) {
            return cachedMetric;
        }

        Map<String, Double> topMetrics = collectTopMetrics(sshInfoId);
        Map<String, Double> networkMetrics = collectNetworkMetrics(sshInfoId, NOT_UPDATE_CACHE);

        if(topMetrics.isEmpty() || networkMetrics.isEmpty()){
            return null;
        }

        MetricResponse.FindCurrentMetricDTO metricDTO = new MetricResponse.FindCurrentMetricDTO(
                topMetrics.getOrDefault(METRIC_MAP_CPU_USAGE, 0.0),
                topMetrics.getOrDefault(METRIC_MAP_TOTAL_MEMORY, 0.0),
                topMetrics.getOrDefault(METRIC_MAP_USED_MEMORY, 0.0),
                networkMetrics.getOrDefault(METRIC_MAP_NETWORK_REC, 0.0),
                networkMetrics.getOrDefault(METRIC_MAP_NETWORK_SENT, 0.0)
        );

        cacheMetricDTO(sshInfoId, metricDTO);

        return metricDTO;
    }

    @Transactional(readOnly = true)
    public MetricResponse.FindMetricHistoryDTO findMetricHistory(int minusHour, Long sshInfoId){
        LocalDateTime now = LocalDateTime.now().withMinute(0).withSecond(0).withNano(0);
        List<Metric> metrics = metricRepository.findALlWithinDate(now.minusHours(minusHour), sshInfoId);

        List<MetricResponse.CpuMetricDTO> cpuMetricDTOS = new ArrayList<>();
        List<MetricResponse.MemoryMetricDTO> memoryMetricDTOS = new ArrayList<>();
        List<MetricResponse.NetworkInMetricDTO> networkInMetricDTOS = new ArrayList<>();
        List<MetricResponse.NetworkOutMetricDTO> networkOutMetricDTOS = new ArrayList<>();

        metrics.forEach(metric -> {
            String time = metric.getCreatedDate().format(formatterForHourAndMin);

            double cpuUsage = Math.round(metric.getCpuUsage() * 1000.0) / 1000.0;
            cpuMetricDTOS.add(new MetricResponse.CpuMetricDTO(time, cpuUsage));

            double memoryUsage = metric.getTotalMemory() > 0 ?
                    Math.round((metric.getUsedMemory() / metric.getTotalMemory() * 100) * 1000.0) / 1000.0 : 0.0;
            memoryMetricDTOS.add(new MetricResponse.MemoryMetricDTO(time, memoryUsage));

            double networkReceived = Math.round(metric.getTotalBytesReceived() * 1000.0) / 1000.0;
            double networkSent = Math.round(metric.getTotalBytesSent() * 1000.0) / 1000.0;
            networkInMetricDTOS.add(new MetricResponse.NetworkInMetricDTO(time, networkReceived));
            networkOutMetricDTOS.add(new MetricResponse.NetworkOutMetricDTO(time, networkSent));
        });

        return new MetricResponse.FindMetricHistoryDTO(cpuMetricDTOS, memoryMetricDTOS, networkInMetricDTOS, networkOutMetricDTOS);
    }

    private Map<String, Double> collectTopMetrics(Long sshInfoId) {
        Map<String, Double> metricsMap = new HashMap<>();

        String commandResponse = sshService.executeCommandOnce(COMMAND_TOP, sshInfoId);

        String[] lines = commandResponse.split("\n");

        for (String line : lines) {
            line = line.trim();

            Matcher cpuMatcher = CPU_PATTERN.matcher(line);
            if (cpuMatcher.matches()) {
                double usUsage = Double.parseDouble(cpuMatcher.group(1));
                double syUsage = Double.parseDouble(cpuMatcher.group(2));
                double cpuUsage = usUsage + syUsage;
                metricsMap.put(METRIC_MAP_CPU_USAGE, cpuUsage);
                continue;
            }

            Matcher memMatcher = MEM_PATTERN.matcher(line);
            if (memMatcher.matches()) {
                double memTotal = Double.parseDouble(memMatcher.group(1));
                double memUsed = Double.parseDouble(memMatcher.group(3));
                metricsMap.put(METRIC_MAP_TOTAL_MEMORY, memTotal);
                metricsMap.put(METRIC_MAP_USED_MEMORY, memUsed);
            }
        }

        return metricsMap;
    }

    private Map<String, Double> collectNetworkMetrics(Long sshInfoId, boolean updateCache) {
        Map<String, Double> currentNetworkMetric = collectCurrentNetworkMetrics(sshInfoId);

        if(currentNetworkMetric.isEmpty()){
            return Collections.emptyMap();
        }

        double previousReceived = redisService.getDataInDouble(REDIS_KEY_NETWORK_REC);
        double previousTransmitted = redisService.getDataInDouble(REDIS_KEY_NETWORK_TRANS);

        double receivedDiff = currentNetworkMetric.getOrDefault(METRIC_MAP_NETWORK_REC, 0.0) - previousReceived;
        double transmittedDiff = currentNetworkMetric.getOrDefault(METRIC_MAP_NETWORK_SENT, 0.0) - previousTransmitted;

        Map<String, Double> metricsMap = new HashMap<>();
        metricsMap.put(METRIC_MAP_NETWORK_REC, receivedDiff);
        metricsMap.put(METRIC_MAP_NETWORK_SENT, transmittedDiff);

        if(updateCache) {
            updateNetworkCache(currentNetworkMetric);
        }

        return metricsMap;
    }

    private Map<String, Long> getTodayNetworkTraffic(Long sshInfoId) {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        List<Metric> metrics = metricRepository.findALlWithinDate(todayStart, sshInfoId);

        double dailyReceived = metrics.stream()
                .mapToDouble(Metric::getTotalBytesReceived)
                .sum();

        double dailySent = metrics.stream()
                .mapToDouble(Metric::getTotalBytesSent)
                .sum();

        Map<String, Long> dailyTraffic = new HashMap<>();
        dailyTraffic.put(METRIC_MAP_DAILY_NET_REC, (long) dailyReceived);
        dailyTraffic.put(METRIC_MAP_DAILY_NET_SENT, (long) dailySent);

        return dailyTraffic;
    }

    private Map<String, Double> collectCurrentNetworkMetrics(Long sshInfoId) {
        String commandResponse = sshService.executeCommandOnce(COMMAND_NETWORK_USAGE, sshInfoId);

        Map<String, Double> networkUsageMap = new HashMap<>();

        Pattern pattern = Pattern.compile("^(eth|ens|enp|wlan)\\S*:");

        String[] lines = commandResponse.split("\\n");
        for (String line : lines) {
            String trimmedLine = line.trim();

            Matcher matcher = pattern.matcher(trimmedLine);
            if (matcher.find()) {
                String[] parts = trimmedLine.split("\\s+");
                if (parts.length >= 10) {
                    try {
                        long receivedBytes = Long.parseLong(parts[1]); 
                        long transmittedBytes = Long.parseLong(parts[9]);  

                        double receivedMB = receivedBytes / (1024.0 * 1024.0);
                        double transmittedMB = transmittedBytes / (1024.0 * 1024.0);

                        networkUsageMap.put(METRIC_MAP_NETWORK_REC, receivedMB);
                        networkUsageMap.put(METRIC_MAP_NETWORK_SENT, transmittedMB);
                        break;  
                    } catch (NumberFormatException e) {
                        log.error("네트워크 사용량 파싱 중 오류 발생: " + line + ", 오류 메시지: " + e.getMessage());
                    }
                }
            }
        }

        if (networkUsageMap.isEmpty()) {
            log.error("유효한 네트워크 인터페이스가 존재하지 않음.");
        }

        return networkUsageMap;
    }

    private MetricResponse.FindCurrentMetricDTO getCachedMetric(Long sshInfoId) {
        String cachedValue = redisService.getDataInStr(METRIC_KEY, sshInfoId.toString());

        if (cachedValue == null) {
            return null;
        }

        return convertStringToMetricDTO(cachedValue);
    }

    private MetricResponse.FindCurrentMetricDTO convertStringToMetricDTO(String value) {
        try {
            return objectMapper.readValue(value, MetricResponse.FindCurrentMetricDTO.class);
        } catch (JsonProcessingException e) {;
            log.info("ObjectMapper 파싱 과정에서 에러 발생");
            return null; 
        }
    }

    private String convertMetricDtoToString(MetricResponse.FindCurrentMetricDTO metricDTO){
        try {
            return objectMapper.writeValueAsString(metricDTO);
        } catch (JsonProcessingException e) {
            log.info("ObjectMapper 파싱 과정에서 에러 발생");
            return "";
        }
    }

    private void cacheMetricDTO(Long sshInfoId, MetricResponse.FindCurrentMetricDTO metricDTO) {
        String value = convertMetricDtoToString(metricDTO);
        if (!value.isBlank()) {
            redisService.storeValue(METRIC_KEY, sshInfoId.toString(), value, METRIC_EXP);
        }
    }

    private void updateNetworkCache(Map<String, Double> currentNetworkMetric) {
        redisService.storeValue(REDIS_KEY_NETWORK_REC, String.valueOf(currentNetworkMetric.get(METRIC_MAP_NETWORK_REC)));
        redisService.storeValue(REDIS_KEY_NETWORK_TRANS, String.valueOf(currentNetworkMetric.get(METRIC_MAP_NETWORK_SENT)));
    }
}