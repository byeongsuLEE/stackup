package com.ssafy.stackup.domain.framework.dto;

import com.ssafy.stackup.domain.framework.entity.Framework;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class FrameworkRequest {
    private Long frameworkId;
    private String name;

    public FrameworkRequest(Framework framework) {
        this.frameworkId = framework.getId();
        this.name = framework.getName();
    }
}
