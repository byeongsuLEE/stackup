package com.ssafy.stackup.domain.board.entity;


import com.ssafy.stackup.domain.framework.entity.Framework;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_framework")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardFramework {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_framework_id")
    private Long boardFrameworkId;

    @ManyToOne
    @JoinColumn(name = "framwork_id")
    private Framework framework;

    @ManyToOne
    @JoinColumn(name = "board_id")
    private Board board;
}
