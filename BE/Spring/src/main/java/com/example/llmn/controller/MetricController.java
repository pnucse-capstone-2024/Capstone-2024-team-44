package com.example.llmn.controller;

import com.example.llmn.core.security.CustomUserDetails;
import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.service.MetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class MetricController {

    private final MetricService metricService;

    /*@GetMapping("/metrics/history")
    public ResponseEntity<?> findMetricHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        MetricResponse.FindMetricHistoryDTO responseDTO = metricService.findMetricHistory(METRIC_HISTORY_PREVIOUS_HOUR, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }*/
}
