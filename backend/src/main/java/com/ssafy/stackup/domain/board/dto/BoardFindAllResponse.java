package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import lombok.Data;

import java.awt.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class BoardFindAllResponse {
    private Long boardId;
    private String title;
    private String classification;
    private List<FrameworkRequest> frameworks;
    private List<LanguageRequest> languages;
    private String deposit;
    private Date startDate;
    private String period;
    private Long recruits;
    private Long applicants;
    private Boolean worktype;
    private Date deadline;
    private Date upload;
    public BoardFindAllResponse() {}

    public BoardFindAllResponse(Board board) {
        this.boardId = board.getBoardId();
        this.title = board.getTitle();
        this.classification = board.getClassification();
        this.frameworks = board.getBoardFrameworks().stream()
                .map(framework -> new FrameworkRequest(framework.getFramework()))
                .collect(Collectors.toList());
        this.languages = board.getBoardLanguages().stream()
                .map(language -> new LanguageRequest(language.getLanguage()))
                .collect(Collectors.toList());
        this.deposit = board.getDeposit();
        this.startDate = board.getStartDate();
        this.period = board.getPeriod();
        this.recruits = board.getRecruits();
        this.applicants = board.getApplicants();
        this.worktype = board.getWorktype();
        this.deadline = board.getDeadline();
        this.upload = board.getUpload();
//        if(board.getBoardFrameworks() != null) {
//            this.frameworks = board.getBoardFrameworks().stream()
//                    .map(framework -> new FrameworkRequest(framework.getFramework()))
//                    .collect(Collectors.toList());
//        } else {
//            this.frameworks = new ArrayList<>();
//        }
//        if (board.getBoardLanguages() != null) {
//            this.languages = board.getBoardLanguages().stream()
//                    .map(language -> new LanguageRequest(language.getLanguage()))
//                    .collect(Collectors.toList());
//        } else {
//            this.languages = new ArrayList<>();
//        }
    }
}
