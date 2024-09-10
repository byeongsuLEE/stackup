package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class BoardFindOneResponse {
    private Long boardId;
    private String title;
    private String description;
    private String classification;
    private List<FrameworkRequest> frameworks; // 프레임워크 ID 목록
    private List<LanguageRequest> languages;  // 언어 ID 목록
    private Long deposit;
    private Date startDate;
    private String period;
    private Long recruits;
    private Long applicants;
    private Boolean worktype;
    private String requirements;
    private Boolean isCharged;
    private String address;
    private Date deadline;
    private Date upload;
//    private List<Long> applicantIds;

    public BoardFindOneResponse() {}

    public BoardFindOneResponse(Board board) {
        this.boardId = board.getBoardId();
        this.title = board.getTitle();
        this.description = board.getDescription();
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
        this.requirements = board.getRequirements();
        this.isCharged = board.getIsCharged();
        this.address = board.getAddress();
        this.deadline = board.getDeadline();
        this.upload = board.getUpload();
//        this.applicantIds = board.getApplicants();
    }
}
