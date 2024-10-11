package com.ssafy.stackup.domain.board.entity;


import com.ssafy.stackup.domain.framework.entity.Framework;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    @JoinColumn(name = "framework_id")
//    @Field(type= FieldType.Object)
    private Framework framework;


//    @ManyToOne
//    @JoinColumn(name = "board_id")
//    private Board board;
}
