package com.ssafy.stackup.domain.recommend.dto;

import com.ssafy.stackup.domain.board.entity.Level;
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
    private Level level;
    private String requirements;
    private String worktype;
}
