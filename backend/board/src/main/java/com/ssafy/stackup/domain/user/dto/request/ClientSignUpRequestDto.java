package com.ssafy.stackup.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSignUpRequestDto {
    private String email;
    private String name;
    private String password;
    private String businessRegistrationNumber;
    private String businessName;
    private String phone;

}
