package com.example.llmn.controller;

import com.example.llmn.controller.DTO.AlarmRequest;
import com.example.llmn.controller.DTO.AlarmResponse;
import com.example.llmn.core.security.CustomUserDetails;
import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.service.AlarmService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class AlarmController {

    private final AlarmService alarmService;

    @GetMapping("/alarms")
    public ResponseEntity<?> findAlarmList(@AuthenticationPrincipal CustomUserDetails userDetails){
        AlarmResponse.FindAlarmListDTO responseDTO = alarmService.findAlarmList(userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @PostMapping("/alarms/read")
    public ResponseEntity<?> readAlarm(@RequestBody AlarmRequest.ReadAlarmDTO requestDTO, @AuthenticationPrincipal CustomUserDetails userDetails){
        alarmService.readAlarm(requestDTO, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, null));
    }
}
