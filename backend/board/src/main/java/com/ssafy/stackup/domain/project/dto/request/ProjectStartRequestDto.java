package com.ssafy.stackup.domain.project.dto.request;

import lombok.Getter;

import java.util.List;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-22
 * 설명    :
 */
@Getter

public class ProjectStartRequestDto {
    private List<Long> freelancerIdList;
    private Long boardId;
}
