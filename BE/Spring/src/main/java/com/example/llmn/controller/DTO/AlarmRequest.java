package com.example.llmn.controller.DTO;

import java.util.List;

public class AlarmRequest {

    public record ReadAlarmDTO(List<Long> alarmIds) {}
}
