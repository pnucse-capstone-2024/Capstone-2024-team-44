package com.example.llmn.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum UserRole {

    USER("유저"),
    ADMIN("관리자"),
    SUPER("슈퍼");

    private String value;
}