package com.example.llmn.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SummaryType {

    LOG("로그"),
    PERFORMANCE("성능"),
    HOURLY("시간별"),
    DAILY("일일"),
    TEND("트렌드"),
    RECOMMENDATION("추천");

    private String value;
}
