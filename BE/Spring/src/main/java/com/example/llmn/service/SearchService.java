package com.example.llmn.service;

import com.example.llmn.controller.DTO.SearchResponse;
import com.example.llmn.domain.Project;
import com.example.llmn.domain.Summary;
import com.example.llmn.repository.ProjectRepository;
import com.example.llmn.repository.SummaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final LogService logService;
    private final ProjectRepository projectRepository;
    private final SummaryRepository summaryRepository;
    private static final String LOG_FILE_URL_TEMPLATE = "/project/%d/%s";

    @Transactional(readOnly = true)
    public SearchResponse.SearchDTO search(String keyword, LocalDateTime startDate, LocalDateTime endDate, Long userId){
        String lowerCaseKeyword = keyword.toLowerCase();

        List<Project> projects = projectRepository.findByUserId(userId);
        Map<String, Long> containerNameToIdMap = projects.stream()
                .collect(Collectors.toMap(Project::getContainerName, Project::getId));

        List<String> logFiles = logService.findLogFileList();
        List<SearchResponse.LogFileDTO> searchedLogDTOS = searchLogFiles(logFiles, lowerCaseKeyword, startDate, endDate, containerNameToIdMap);

        List<SearchResponse.InsightDTO> searchedInsightDTOS = searchInsights(projects, lowerCaseKeyword, startDate, endDate);

        return new SearchResponse.SearchDTO(searchedLogDTOS, searchedInsightDTOS);
    }

    private List<SearchResponse.LogFileDTO> searchLogFiles(List<String> logFiles, String keyword, LocalDateTime startDate, LocalDateTime endDate, Map<String, Long> containerNameToIdMap) {
        return logFiles.stream()
                .filter(logFileName -> logFileName.toLowerCase().contains(keyword)) 
                .filter(logFileName -> { 
                    LocalDateTime logDateTime = extractDateTime(logFileName);
                    return isWithinDateRange(logDateTime, startDate, endDate);
                })
                .map(logFileName -> { 
                    String containerName = extractContainerName(logFileName);
                    Long projectId = containerNameToIdMap.get(containerName);
                    String redirectURL = buildLogfileRedirectURL(projectId,logFileName);
                    return new SearchResponse.LogFileDTO(logFileName, redirectURL);
                })
                .toList();
    }

    private List<SearchResponse.InsightDTO> searchInsights(List<Project> projects, String keyword, LocalDateTime startDate, LocalDateTime endDate){
        List<Project> relatedProjects = projects.stream()
                .filter(project -> project.getProjectName().toLowerCase().contains(keyword)
                        || project.getContainerName().toLowerCase().contains(keyword)
                        || keyword.contains(project.getProjectName().toLowerCase())
                        || keyword.contains(project.getContainerName().toLowerCase()))
                .distinct()
                .toList();

        List<Summary> summaries = summaryRepository.findByProjectsAndDateRange(relatedProjects, startDate, endDate);

        return summaries.stream()
                .map(summary -> new SearchResponse.InsightDTO(
                        summary.getProject().getProjectName(),
                        formatLocalDateTime(summary.getCreatedDate()),
                        summary.getSummaryType(),
                        summary.getContent()))
                .toList();
    }

    private String extractContainerName(String logFileName) {
        if (logFileName == null || logFileName.isEmpty()) {
            return "";
        }

        String[] parts = logFileName.split("-");

        return parts.length > 0 ? parts[0] : "";
    }

    public LocalDateTime extractDateTime(String logFileName) {
        if (logFileName == null || logFileName.isEmpty()) {
            return null;
        }

        String regex = ".*-log-(\\d{4}-\\d{2}-\\d{2})_(\\d{2})-\\d+\\.txt";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(logFileName);

        if (matcher.matches()) {
            String datePart = matcher.group(1); 
            String hourPart = matcher.group(2); 
            String dateTimeString = datePart + " " + hourPart;

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH");

            return LocalDateTime.parse(dateTimeString, formatter);
        } else {
            log.info("로그 파일 목록 중 잘못된 형식의 파일이 존재.");
            return null;
        }
    }

    private String buildLogfileRedirectURL(Long projectId, String fileName) {
        return String.format(LOG_FILE_URL_TEMPLATE, projectId, fileName);
    }

    private String formatLocalDateTime(LocalDateTime localDateTime) {
        if(localDateTime == null){
            return null;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return localDateTime.format(formatter);
    }

    private boolean isWithinDateRange(LocalDateTime data, LocalDateTime startDate, LocalDateTime endDate) {
        return data != null && (data.isEqual(startDate) || data.isAfter(startDate)) // 시작일자 이후
                && (data.isEqual(endDate) || data.isBefore(endDate)); // 종료일자 이전
    }
}
