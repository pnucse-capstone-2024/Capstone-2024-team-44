package com.example.llmn.controller.DTO;

import com.example.llmn.domain.AlarmType;

import java.time.LocalDateTime;
import java.util.List;

public class AlarmResponse {

    public record FindAlarmListDTO(List<AlarmDTO> alarms) {}

    public record AlarmDTO(Long id,
                           String content,
                           LocalDateTime generatedDate,
                           AlarmType type,
                           boolean isRead) {}
}
