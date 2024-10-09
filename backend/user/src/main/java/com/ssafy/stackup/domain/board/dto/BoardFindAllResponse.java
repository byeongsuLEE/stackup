package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import com.ssafy.stackup.domain.user.dto.response.ClientResponseDto;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class BoardFindAllResponse {
    private Long boardId;
    private boolean isStartProject;
    private String title;
    private String description;
    private String classification;
    private ClientResponseDto client;
    private List<FrameworkRequest> frameworks;
    private List<LanguageRequest> languages;
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
    private Level level;
    public BoardFindAllResponse() {}

    public BoardFindAllResponse(Board board) {
        if(board.getProject()!=null){
            this.isStartProject = true;
        }else {
            this.isStartProject = false;
        }

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
        this.address = board.getAddress();
        this.period = board.getPeriod();
        this.recruits = board.getRecruits();
        this.isCharged = board.getIsCharged();
        this.applicants = board.getApplicants();
        this.worktype = board.getWorktype();
        this.deadline = board.getDeadline();
        this.upload = board.getUpload();
        this.level = board.getLevel();
        // Client 정보를 ClientResponseDto로 변환
        if (board.getClient() != null) {
            this.client = ClientResponseDto.builder()
                    .id(board.getClient().getId())
                    .name(board.getClient().getName())
                    .email(board.getClient().getEmail())
                    .phone(board.getClient().getPhone())
                    .secondPassword(board.getClient().getSecondPassword())
                    .accountKey(board.getClient().getAccountKey())
                    .mainAccount(board.getClient().getMainAccount())
                    .totalScore(board.getClient().getTotalScore())
                    .reportedCount(board.getClient().getReportedCount())
                    .roles(board.getClient().getRoles())
                    .businessRegistrationNumber(board.getClient().getBusinessRegistrationNumber())
                    .businessName(board.getClient().getBusinessName())
                    .build();
        }
    }
}
