package com.ssafy.stackup.domain.project.dto;

import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.framework.dto.FrameworkRequest;
import com.ssafy.stackup.domain.language.dto.LanguageRequest;
import com.ssafy.stackup.domain.project.entity.ProjectStatus;
import com.ssafy.stackup.domain.project.entity.ProjectStep;
import lombok.*;

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
    private ProjectStatus status;
    private ProjectStep step;
    private String title;
    private Date startDate;
    private String period;
    private String classification;  //대분류
    private Long deposit;
    private List<String> frameworks;
    private List<String> languages;

    private Long recruits;  //모집인원

    private Boolean isCharged;
    private Long applicants;
    private Boolean worktype;
    private Date deadline;
    private Date upload;
    private Level level;

}
