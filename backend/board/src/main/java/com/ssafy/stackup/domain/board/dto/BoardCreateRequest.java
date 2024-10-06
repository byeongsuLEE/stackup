package com.ssafy.stackup.domain.board.dto;

import com.ssafy.stackup.domain.board.entity.Level;
import com.ssafy.stackup.domain.framework.dto.BoardFrameworkUpdateRequest;
import com.ssafy.stackup.domain.language.dto.BoardLanguageUpdateRequest;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class BoardCreateRequest {
    private String title;
    private String description;
    private String classification;
//    private List<BoardFrameworkUpdateRequest> frameworks;
//    private List<BoardLanguageUpdateRequest> languages;
    private List<BoardFrameworkUpdateRequest> frameworks = new ArrayList<>(); // 프레임워크
    private List<BoardLanguageUpdateRequest> languages = new ArrayList<>();  // 언어
    private Long deposit;
    private Date startDate;
    private String period;
    private Long recruits;
    private Long applicants;
    private Boolean worktype;
    private String requirements;
    private Boolean isCharged;
    private String address;
    private Level level;
    private Date deadline;
    private Date upload;
    private List<Long> applicantIds;
}
