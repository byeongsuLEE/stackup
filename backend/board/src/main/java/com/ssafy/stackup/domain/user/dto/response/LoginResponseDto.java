package com.ssafy.stackup.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-13
 * 설명    :
 */
@Getter
@Builder
public class LoginResponseDto {
    private Long id;
    private String userType;
}
