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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;


    @Enumerated(EnumType.STRING)
    @Column(name = "step")
    private ProjectStep step; // 프로젝트 단계

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status; // 프로젝트 상태 (before,pending, progress, finished 등)


    @Column
    private String title;

    @Column
    private String period;


    @Column(name = "certificate_url")
    private String certificateUrl;

    @Builder.Default
    @Column(name ="client_step_confirmed")
    private boolean clientStepConfirmed = false;

    @Builder.Default
    @Column(name = "freelancer_step_confirmed")
    private boolean freelancerStepConfirmed = false;

    @OneToMany (mappedBy = "project" , cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FreelancerProject> freelancerProjectList;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board; // 프로젝트 모집 게시글 (1대다 관계)

    private String previousProjectStartDate ;
    private String previousProjectEndDate ;

    private Long previousProjectEndRegistFreelancerId;


    public ProjectStep nextProjectStep(){
        this.step =  this.step.next();
        return  this.step;
    }

    /**
     * 모든 지원자 + 클라이언트가 서명 했는지 확인 메서드!
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-10-07
     * @ 설명     :
     * @return

     */
    public boolean isAllFreelancersSigned (){
        for (FreelancerProject freelancerProject : this.freelancerProjectList) {
            if (!freelancerProject.checkUsersSignConfirm()) {
                return false; // 한 명이라도 서명을 하지 않으면 false 반환
            }
        }
        return true; // 모든 프리랜서가 서명을 완료했으면 true 반환
    }


    public void finishProjectStep(){
        this.status =  ProjectStatus.FINISH;
    }


    /**
     *
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     :단계 확인 체크 메서드
     * @return
     */
    public  boolean checkUsersConfirm(){
        return this.clientStepConfirmed && this.freelancerStepConfirmed;
    }

    /**
     * 다음 단계 시 상태초기화
     * @ 작성자   : 이병수
     * @ 작성일   : 2024-09-24
     * @ 설명     :

     */
    public void resetUserStepConfirmed(){
        this.clientStepConfirmed = false;
        this.freelancerStepConfirmed = false;

    }

    public void updateStatus(ProjectStatus projectStatus) {
        this.status = projectStatus;
    }
    public void updateIsFreelancerConfirmed() {
        this.freelancerStepConfirmed = true;
    }
    public void updateIsClientStepConfirmed() {
        this.clientStepConfirmed = true;
    }
}
