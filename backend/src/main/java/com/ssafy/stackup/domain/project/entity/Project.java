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

    @OneToMany (mappedBy = "project" , cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<FreelancerProject> freelancerProjectList;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board; // 프로젝트 모집 게시글 (1대다 관계)

}
