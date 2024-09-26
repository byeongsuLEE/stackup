package com.ssafy.stackup.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ClientLoginResponseDto {
    private Long id;
    private String userType;

}
