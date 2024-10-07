package com.ssafy.stackup.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
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
    private String userType;
    private String name;
    private String email;
    private String phone;
    private String userAddress;
    private String publicKey;
    private String secondPassword;
    private String accountKey;
    private Double totalScore;
    private Integer reportedCount;
    private String mainAccount;
    private Integer evaluatedCount;
    protected List<String> roles;

    // 특정 역할이 있는지 확인하는 메서드
    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }

    public boolean isFreelancer() {
        return hasRole("ROLE_FREELANCER");
    }

    public boolean isClient() {
        return hasRole("ROLE_CLIENT");
    }
}


