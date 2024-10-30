package com.example.llmn.controller;

import com.example.llmn.controller.DTO.LogDataDTO;
import com.example.llmn.core.security.CustomUserDetails;
import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class LogController {

    private final LogService logService;

    @GetMapping("/logs")
    public ResponseEntity<?> searchLogs(@RequestParam Instant startTime,
                                        @RequestParam Instant endTime,
                                        @RequestParam(required = false) String logLevel,
                                        @RequestParam(required = false) String serviceName,
                                        @RequestParam String elasticSearchHost) {
        List<LogDataDTO> responseDTO = logService.searchLogList(startTime, endTime, logLevel, serviceName, elasticSearchHost);
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }

    @GetMapping("/logs/{logFileName}/download")
    public ResponseEntity<Resource> downloadLogFile(@PathVariable String logFileName) {
        Resource resource = logService.getLogFileAsResource(logFileName);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(MediaType.TEXT_PLAIN_VALUE))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + logFileName + "\"")
                .body(resource);
    }
}
