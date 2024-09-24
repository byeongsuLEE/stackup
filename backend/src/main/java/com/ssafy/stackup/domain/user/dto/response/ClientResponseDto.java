package com.ssafy.stackup.domain.user.dto.response;

import lombok.*;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientResponseDto extends UserInfoResponseDto {

    private String businessRegistrationNumber;
    private String businessName;

}
