package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class BoardSearchResponse {
    private Long boardId;
    private String title;
    private String description;
    private String classification;
    private List<FrameworkRequest> frameworks;
    private List<LanguageRequest> languages;
    public BoardSearchResponse() {}
    public BoardSearchResponse(Board board) {
        this.boardId = board.getBoardId();
        this.title = board.getTitle();
        this.classification = board.getClassification();
        this.description = board.getDescription();
        this.frameworks = board.getBoardFrameworks().stream()
                .map(framework -> new FrameworkRequest(framework.getFramework()))
                .collect(Collectors.toList());
        this.languages = board.getBoardLanguages().stream()
                .map(language -> new LanguageRequest(language.getLanguage()))
                .collect(Collectors.toList());

    }
}
