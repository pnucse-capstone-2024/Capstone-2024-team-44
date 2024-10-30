package com.example.llmn.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ContainerStatus {

    NOT_CONNECTED("연결 안됨"),
    WORKING("작동중"),
    NOT_WORKING("종료됨");

    private String value;
}
