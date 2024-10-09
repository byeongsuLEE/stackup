package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import com.ssafy.stackup.domain.user.dto.response.ClientResponseDto;
import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import lombok.Data;

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
    private String address; // 실제 근무지
    private Level level;
    private Date deadline;
    private Date upload;
    private List<BoardApplicantRequest> applicantList;
    private ClientResponseDto client;
    private boolean isStartProject;

    public BoardFindOneResponse() {}

    public BoardFindOneResponse(Board board) {
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
        this.period = board.getPeriod();
        this.recruits = board.getRecruits();
        this.applicants = board.getApplicants();
        this.worktype = board.getWorktype();
        this.requirements = board.getRequirements();
        this.isCharged = board.getIsCharged();
        this.address = board.getAddress();
        this.level = board.getLevel();
        this.deadline = board.getDeadline();
        this.upload = board.getUpload();
        this.applicantList = board.getBoardApplicants().stream()
                .map(boardApplicant -> {
                    Freelancer freelancer = boardApplicant.getFreelancer();
                    BoardApplicantRequest request = new BoardApplicantRequest(boardApplicant);
//                    request.setIsPassed(boardApplicant.isPassed()); // BoardApplicant의 isPassed 값 추가
                    return request;
                })
                .collect(Collectors.toList());
//        this.applicantList = board.getBoardApplicants() != null ? board.getBoardApplicants().stream()
//                .map(freelancer -> new BoardApplicantRequest(freelancer.getFreelancer()))
//                .collect(Collectors.toList()) : Collections.emptyList();

        if(board.getClient() != null) {
            Client client = board.getClient();
            this.client = ClientResponseDto.builder()
                    .id(client.getId())
                    .name(client.getName())
                    .businessName(client.getBusinessName())
                    .totalScore(client.getTotalScore())
                    .build();
        }
    }
}
