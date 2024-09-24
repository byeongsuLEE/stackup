package com.ssafy.stackup.domain.project.entity;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.user.entity.Client;
import com.ssafy.stackup.domain.user.entity.FreelancerProject;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Project{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id",  unique = true, nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @Column(name = "step")
    private ProjectStep step; // 프로젝트 단계

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status; // 프로젝트 상태 (pending, progress, finished 등)


    @Column
    private String title;

    @Column
    private String period;


    @Column(name = "certificate_url")
    private String certificateUrl;

    @Column(name ="client_step_confirmed")
    private boolean clientStepConfirmed;

    @Column(name = "freelancer_step_confirmed")
    private boolean freelancerStepConfirmed;

    @OneToMany (mappedBy = "project" , cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FreelancerProject> freelancerProjectList;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board; // 프로젝트 모집 게시글 (1대다 관계)

    void nextProjectStep(){
       this.step =  this.step.next();
    }

    void finishProjectStep(){
        this.status =  ProjectStatus.FINISH;
    }


    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     :단계 확인 체크 메서드
     * @return
     */
    boolean checkUsersConfirm(){
        return this.clientStepConfirmed && this.freelancerStepConfirmed;
    }

    /**
     * 다음 단계 시 상태초기화
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     :

     */
    void resetUserStepConfirmed(){
        this.clientStepConfirmed = false;
        this.freelancerStepConfirmed = false;

    }

}
