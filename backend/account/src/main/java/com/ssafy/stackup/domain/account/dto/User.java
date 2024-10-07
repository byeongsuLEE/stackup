package com.ssafy.stackup.domain.account.dto;

import lombok.*;

import java.util.List;

/**
 * 작성자   : user
 * 작성날짜 : 2024-10-05
 * 설명    :
 */

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
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


    private String githubId; // 프리랜서
    private String portfolioURL; // 프리랜서
    private String selfIntroduction; // 프리랜서
    private String address; // 프리랜서
    private Integer careerYear; // 프리랜서
    private String classification; // 프리랜서
    private String businessRegistrationNumber; // 클라이언트
    private String businessName; // 클라이언트
    private List<String> framework;
    private List<String> language;
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
