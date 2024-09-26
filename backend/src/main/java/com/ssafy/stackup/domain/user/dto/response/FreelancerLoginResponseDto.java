package com.ssafy.stackup.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter

public class FreelancerLoginResponseDto {
    private Long userId;
    private String userType;
    private String accessToken;
    private String refreshToken;
}
