package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import lombok.Data;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class BoardFindAllResponse {
    private String title;
    private List<FrameworkRequest> frameworks;
    private List<LanguageRequest> languages;

    public BoardFindAllResponse() {}

    public BoardFindAllResponse(Board board) {
        this.title = board.getTitle();
        if(board.getBoardFrameworks() != null) {
            this.frameworks = board.getBoardFrameworks().stream()
                    .map(framework -> new FrameworkRequest(framework.getFramework()))
                    .collect(Collectors.toList());
        } else {
            this.frameworks = new ArrayList<>();
        }
        if (board.getBoardLanguages() != null) {
            this.languages = board.getBoardLanguages().stream()
                    .map(language -> new LanguageRequest(language.getLanguage()))
                    .collect(Collectors.toList());
        } else {
            this.languages = new ArrayList<>();
        }
    }
}
