package com.ssafy.stackup.domain.language.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LanguageResponse {
    private Long languageId;
    private String name;

    public LanguageResponse(Long languageId, String name) {
        this.languageId = languageId;
        this.name = name;
    }
}
