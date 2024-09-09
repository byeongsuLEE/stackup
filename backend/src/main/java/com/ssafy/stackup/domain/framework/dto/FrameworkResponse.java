package com.ssafy.stackup.domain.framework.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class FrameworkResponse {
    private Long frameworkId;
    private String name;

    public FrameworkResponse(Long frameworkId, String name) {
        this.frameworkId = frameworkId;
        this.name = name;
    }
}
