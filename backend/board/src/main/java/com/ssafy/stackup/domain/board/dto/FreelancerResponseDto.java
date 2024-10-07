package com.ssafy.stackup.domain.board.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FreelancerResponseDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String classification;
    private String portfolioUrl;
    private String selfIntroduction;
    private Integer careerYear;
//    private List<String> frameworks; // 프레임워크 목록
//    private List<String> languages; // 언어 목록
}
