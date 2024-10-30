package com.example.llmn.controller;

import com.example.llmn.controller.DTO.SearchResponse;
import com.example.llmn.core.security.CustomUserDetails;
import com.example.llmn.core.utils.ApiUtils;
import com.example.llmn.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api")
public class SearchController {

    private final SearchService searchService;
    private static final LocalDateTime DEFAULT_START_DATE = LocalDateTime.of(2000, 1, 1, 0, 0);

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String keyword,
                                    @RequestParam(required = false) LocalDateTime startDate,
                                    @RequestParam(required = false) LocalDateTime endDate,
                                    @AuthenticationPrincipal CustomUserDetails userDetails) {
        startDate = Optional.ofNullable(startDate).orElse(DEFAULT_START_DATE);
        endDate = Optional.ofNullable(endDate).orElse(LocalDateTime.now());
        SearchResponse.SearchDTO responseDTO = searchService.search(keyword, startDate, endDate, userDetails.getUser().getId());
        return ResponseEntity.ok().body(ApiUtils.success(HttpStatus.OK, responseDTO));
    }
}