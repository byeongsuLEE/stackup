package com.ssafy.stackup.domain.project.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SignRequest {

    private String message;
    private String signature;
}
