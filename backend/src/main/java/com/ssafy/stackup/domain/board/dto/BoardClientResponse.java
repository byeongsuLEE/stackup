package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardApplicant;
import com.ssafy.stackup.domain.user.dto.response.ClientResponseDto;
import lombok.Data;

@Data
public class BoardClientResponse {
    private ClientResponse client;
    private String title;
    private Long boardId;

    public BoardClientResponse() {}
    public BoardClientResponse(Board board) {
        this.title = board.getTitle();
        this.boardId = board.getBoardId();
        if (board.getClient() != null) {
            this.client = ClientResponse.builder()
                    .id(board.getClient().getId())
                    .name(board.getClient().getName())
                    .build();
        }
    }
}
