package com.example.llmn.controller.DTO;

import com.example.llmn.domain.SummaryType;

import java.util.List;

public class SearchResponse {

    public record SearchDTO(
            List<LogFileDTO> logfiles,
            List<InsightDTO> insights){}

    public record LogFileDTO(
            String fileName,
            String redirectURL){}

    public record InsightDTO(
            String projectName,
            String date,
            SummaryType type,
            String content){}
}
