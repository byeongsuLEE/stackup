package com.ssafy.stackup.domain.language.controller;

import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import com.ssafy.stackup.domain.language.dto.LanguageResponse;
import com.ssafy.stackup.domain.language.entity.Language;
import com.ssafy.stackup.domain.language.service.LanguageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("user/languages")
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping
    public ResponseEntity<?> findAllLanguages() {
        List<Language> languages = languageService.findAllLanguages();

        List<LanguageRequest> languageRequests = languages.stream()
                .map(LanguageRequest::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(languageRequests);
    }

    @GetMapping("/{languageId}")
    public ResponseEntity<?> findLanguageById(@PathVariable Long languageId) {
        Language language = languageService.findLanguageById(languageId);
        LanguageRequest languageRequest = new LanguageRequest(language);
        return ResponseEntity.ok(languageRequest);
    }

    @PostMapping
    public ResponseEntity<?> createLanguage(@RequestBody LanguageRequest request) {
        LanguageResponse languageResponse = languageService.createLanguage(request);

        return ResponseEntity.ok(languageResponse);
    }
}
