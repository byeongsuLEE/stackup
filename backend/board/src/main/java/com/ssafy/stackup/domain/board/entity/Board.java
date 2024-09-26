package com.ssafy.stackup.domain.board.entity;

import com.ssafy.stackup.domain.project.entity.Project;
import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "board")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
//@Document(indexName = "board")
public class Board {

    @Id
    @org.springframework.data.annotation.Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long boardId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;
    private String classification;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "client_id",nullable = false)
    private Client client;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name="board_id")
    private List<BoardFramework> boardFrameworks = new ArrayList<>();

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name="board_id")
    private List<BoardLanguage> boardLanguages = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BoardApplicant> boardApplicants = new ArrayList<>();

    @Column(nullable = false)
    private Long deposit;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false, name="start_date")
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

    @Column(nullable = false, name ="is_charged")
    private Boolean isCharged = false;

    private String address; // 실제 근무지

    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date deadline;

    @Temporal(TemporalType.DATE)
    private Date upload;

    @Enumerated(EnumType.STRING)
    private Level level;

    @JsonIgnore
    @OneToOne(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Project project;




    @PrePersist
    protected void onCreate() {
        if (upload == null) {
            upload = new Date(); // 현재 날짜와 시간으로 설정
        }
        if (isCharged == null) {
            isCharged = false; // 기본값 설정
        }
    }
//    @JsonIgnore
//    @ManyToMany
//    @JoinTable(
//            name = "board_applicant",
//            joinColumns = @JoinColumn(name = "board_id"),
//            inverseJoinColumns = @JoinColumn(name = "applicant_id")
//    )
//    private List<BoardApplicant> boardApplicant;

    public void setBoardFrameworks(List<BoardFramework> frameworks) {
        this.boardFrameworks.clear();
        this.boardFrameworks.addAll(frameworks);
    }

    public void setBoardLanguages(List<BoardLanguage> languages) {
        this.boardLanguages.clear();
        this.boardLanguages.addAll(languages);
    }

    public void addBoardApplicant(BoardApplicant boardApplicant) {
        boardApplicants.add(boardApplicant);
        boardApplicant.setBoard(this);
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public void setIsCharged(boolean isCharged) {
        this.isCharged = isCharged;
    }

    public void setBoardApplicants(BoardApplicant boardApplicant) {
        this.boardApplicants.clear();
        this.boardApplicants.add(boardApplicant);
        boardApplicant.setBoard(this);
    }



}
