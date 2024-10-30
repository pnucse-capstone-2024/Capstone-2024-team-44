package com.example.llmn.service;

import com.example.llmn.controller.DTO.InsightResponse;
import com.example.llmn.domain.Summary;
import com.example.llmn.domain.SummaryType;
import com.example.llmn.repository.SummaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final SummaryRepository summaryRepository;

    @Transactional(readOnly = true)
    public InsightResponse.FindInsightHomeDTO findInsightList() {
        List<SummaryType> types = List.of(SummaryType.PERFORMANCE, SummaryType.DAILY, SummaryType.TEND, SummaryType.RECOMMENDATION);
        List<Summary> latestSummaries = summaryRepository.findLatestByTypes(types);

        Map<SummaryType, Summary> summaryMap = latestSummaries.stream()
                .collect(Collectors.toMap(Summary::getSummaryType, summary -> summary));

        Function<SummaryType, String> getContent = type -> Optional.ofNullable(summaryMap.get(type))
                .map(Summary::getContent)
                .orElse("");

        Function<SummaryType, String> getUpdatedDate = type -> Optional.ofNullable(summaryMap.get(type))
                .map(Summary::getUpdatedDate)
                .map(InsightService::formatLocalDateTime)
                .orElse("");

        return new InsightResponse.FindInsightHomeDTO(
                getContent.apply(SummaryType.PERFORMANCE),
                getUpdatedDate.apply(SummaryType.PERFORMANCE),
                getContent.apply(SummaryType.DAILY),
                getUpdatedDate.apply(SummaryType.DAILY),
                getContent.apply(SummaryType.TEND),
                getUpdatedDate.apply(SummaryType.TEND),
                getContent.apply(SummaryType.RECOMMENDATION),
                getUpdatedDate.apply(SummaryType.RECOMMENDATION)
        );
    }

    @Transactional(readOnly = true)
    public List<InsightResponse.SummaryDTO> findSummaryByType(SummaryType type, Long userId, Pageable pageable){
        List<Summary> performanceSummaries = summaryRepository.findByType(type, userId, pageable).getContent();

        return performanceSummaries.stream()
                .map(summary -> new InsightResponse.SummaryDTO(
                        summary.getId(),
                        formatLocalDateTime(summary.getCreatedDate()),
                        summary.getContent(),
                        summary.isChecked()
                ))
                .toList();
    }

    public static String formatLocalDateTime(LocalDateTime localDateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return localDateTime.format(formatter);
    }
}
