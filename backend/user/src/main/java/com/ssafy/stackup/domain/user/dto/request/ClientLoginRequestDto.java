package com.ssafy.stackup.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-12
 * 설명    :
 */

@Getter
public class ClientLoginRequestDto {
    @NotBlank
    @Email
    private String email;

//    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message="비밀번호는 영문 및 숫자 포함 8자리 이상 20자리 이하 가능합니다.")
    @NotBlank
    private String password;
}
