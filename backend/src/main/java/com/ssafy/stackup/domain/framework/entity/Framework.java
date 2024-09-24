package com.ssafy.stackup.domain.framework.entity;

import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.user.entity.FreelancerFramework;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "framework")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Framework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "framework_id")
    private Long id;

    private String name;

    @OneToMany(mappedBy = "framework", cascade = CascadeType.ALL, orphanRemoval = true)
    List<BoardFramework> boardFrameworks = new ArrayList<>();

    @OneToMany(mappedBy = "framework", cascade = CascadeType.ALL, orphanRemoval = true)
    List<FreelancerFramework> freelancerFrameworkList = new ArrayList<>();
}
