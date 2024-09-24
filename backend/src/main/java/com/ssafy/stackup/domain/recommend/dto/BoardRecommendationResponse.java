package com.ssafy.stackup.domain.recommend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class BoardRecommendationResponse {
    private Long boardId;
    private String title;
    private String description;
    private String level;
    private String requirements;
    private String worktype;
}
