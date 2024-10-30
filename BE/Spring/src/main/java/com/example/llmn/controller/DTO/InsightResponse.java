package com.example.llmn.controller.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class InsightResponse {

    public record FindInsightHomeDTO(
            String performanceSummary,
            String performanceUpdateTime,
            String dailySummary,
            String dailyUpdateTime,
            String trendSummary,
            String trendUpdateTime,
            String recommendation,
            String recommendUpdateTime){}

    public record FindSummaryDTO(List<SummaryDTO> summaries){}

    public record SummaryDTO(Long id, String time, String content, boolean isChecked){}
}
