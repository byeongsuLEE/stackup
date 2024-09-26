package com.ssafy.stackup.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDto {
    private Long id;
    protected String name;
    protected String email;
    private String phone;
    private String secondPassword;
    private String accountKey;
    private Double totalScore;
    private Integer reportedCount;
    protected List<String> roles;
}
