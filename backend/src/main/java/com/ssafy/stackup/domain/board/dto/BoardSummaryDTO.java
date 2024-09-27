package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Level;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardSummaryDTO {
    private Long boardId;
    private String period;
    private Long deposit;
    private Level level;
}
