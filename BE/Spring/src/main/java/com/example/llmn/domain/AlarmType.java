package com.example.llmn.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AlarmType {
    UPDATE("업데이트"),
    EMERGENCY("심각");

    private String value;
}
