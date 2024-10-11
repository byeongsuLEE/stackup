package com.ssafy.stackup.domain.project.dto.response;

import com.ssafy.stackup.domain.project.entity.ProjectStep;
import lombok.Builder;
import lombok.Getter;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-25
 * 설명    :
 */

@Builder
@Getter
public class ProjectStepCheckResponseDto {

    ProjectStep currentStep;
    boolean isChangeProjectStep;
}
