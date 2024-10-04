package com.ssafy.stackup.domain.user.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class FreelancerInfoRequestDto {
    private String name;
    private String email;
    private String address;
    private String phone;
    private String classification;
    private List<String> framework;
    private List<String> language;
    private Integer careerYear;
    private String portfolioUrl;
    private String selfIntroduction;
}
