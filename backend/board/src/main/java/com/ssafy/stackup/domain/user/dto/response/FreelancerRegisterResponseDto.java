package com.ssafy.stackup.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class FreelancerRegisterResponseDto {
    private String name;
    private String email;
    private String password;
    private String phone;
    private String classification;
    private List<String> framework;
    private List<String> language;
    private Integer careerYear;
    private String portfolioURL;
    private String selfIntroduction;
}
