package com.ssafy.stackup.domain.project.entity;

/**
 * 작성자   : 이병수
 * 작성날짜 : 2024-09-21
 * 설명    : 프로젝트 단계
 */
public enum ProjectStep {
    PLANNING,       // 기획 및 설계
    DESIGN,         // 퍼블리셔 및 디자인
    DEVELOPMENT,    // 개발
    TESTING,        // 테스트
    DEPLOYMENT;      // 배포

    // 다음 단계로 이동
    public ProjectStep next() {
        switch (this) {
            case PLANNING: return DESIGN;
            case DESIGN: return DEVELOPMENT;
            case DEVELOPMENT: return TESTING;
            case TESTING: return DEPLOYMENT;
            default: return this;  // 마지막 단계에서 변화 없음
        }
    }
}
