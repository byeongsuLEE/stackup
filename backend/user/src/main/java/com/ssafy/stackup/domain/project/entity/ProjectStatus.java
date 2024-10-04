package com.ssafy.stackup.domain.project.entity;

import jakarta.persistence.Enumerated;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-20
 * 설명    :
 */

public enum ProjectStatus {
    BEFORE,
    PENDING,
    PROGRESS,
    FINISH;

}
