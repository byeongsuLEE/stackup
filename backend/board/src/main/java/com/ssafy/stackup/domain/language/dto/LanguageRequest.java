package com.ssafy.stackup.domain.language.dto;

import com.ssafy.stackup.domain.language.entity.Language;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class LanguageRequest {
    private Long languageId;
    private String name;

    public LanguageRequest(Language language) {
        this.languageId = language.getId();
        this.name = language.getName();
    }
}
