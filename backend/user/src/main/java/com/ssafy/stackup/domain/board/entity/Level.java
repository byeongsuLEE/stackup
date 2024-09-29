package com.ssafy.stackup.domain.board.entity;

public enum Level {
    JUNIOR(0, 3),    // 0-3년
    MID(3, 7),       // 3-7년
    SENIOR(7, Integer.MAX_VALUE); // 7년 이상

    private final int minYears;
    private final int maxYears;

    Level(int minYears, int maxYears) {
        this.minYears = minYears;
        this.maxYears = maxYears;
    }

    public boolean matches(int careerYears) {
        return careerYears >= minYears && careerYears < maxYears;
    }
}
