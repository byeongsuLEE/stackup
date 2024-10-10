package com.ssafy.stackup.domain.project.dto.response;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import com.ssafy.stackup.domain.project.entity.ProjectStep;
import com.ssafy.stackup.domain.user.dto.response.ClientResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.util.Date;
import java.util.List;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-21
 * 설명    :
 */
@Builder
@Getter
public class ProjectInfoResponseDto {
    private Long projectId;
    private Long freelancerProjectId;

    private boolean isMyContractSigned;
    private boolean isMyProjectStepConfirmed;  // freelancer 일때만 확인가능
    private boolean isClientContractSigned;
    private boolean isFreelancerContractSigned;
    private ProjectStatus status;
    private ProjectStep step;
    private String title;
    private Date startDate;
    private String period;
    private String classification;  //대분류
    private Long deposit;
    private List<String> frameworks;
    private List<String> languages;
    private String certificateUrl;
    private Long recruits;  //모집인원

    private Boolean isCharged;
    private Long applicants;
    private Boolean worktype;
    private Date deadline;
    private Date upload;
    private Level level;
    private boolean clientStepConfirmed;
    private boolean freelancerStepConfirmed;
    private ClientResponseDto client;
    private Long boardId;

    private String previousProjectStartDate ;
    private String previousProjectEndDate ;


    public void updateClient (Project project)
    {
        if(project.getClient() !=null){
            Board board = project.getBoard();
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
