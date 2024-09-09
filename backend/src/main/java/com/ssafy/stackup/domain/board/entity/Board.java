package com.ssafy.stackup.domain.board.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "board")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;
    private String classification;

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardFramework> boardFrameworks = new ArrayList<>();

    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardLanguage> boardLanguages = new ArrayList<>();

    @Column(nullable = false)
    private String deposit;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date startDate;

    @Column(nullable = false)
    private String period;

    @Column(nullable = false)
    private Long recruits; //모집인원

    private Long applicants; //지원자수

    @Column(nullable = false)
    private Boolean worktype; // T: 재택, F: 상주

    @Column(nullable = false)
    private String requirements;

    private Boolean isCharged;

    private String address;

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date deadline;

    @Temporal(TemporalType.DATE)
    private Date upload;

    @PrePersist
    protected void onCreate() {
        if (upload == null) {
            upload = new Date(); // 현재 날짜와 시간으로 설정
        }
    }

    @ManyToMany
    @JoinTable(
            name = "board_applicant",
            joinColumns = @JoinColumn(name = "board_id"),
            inverseJoinColumns = @JoinColumn(name = "applicant_id")
    )
    private List<BoardApplicant> boardApplicant;

    public void setBoardFrameworks(List<BoardFramework> frameworks) {
        this.boardFrameworks.clear();
        this.boardFrameworks.addAll(frameworks);
    }

    public void setBoardLanguages(List<BoardLanguage> languages) {
        this.boardLanguages.clear();
        this.boardLanguages.addAll(languages);
    }

}
