package com.ssafy.stackup.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;


@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerResponseDto extends UserInfoResponseDto{
    private String githubId;
    private String portfolioURL;
    private String selfIntroduction;
    private String address;
    private Integer careerYear;
    private String classification;
    private List<String> framework;
    private List<String> language;
}
