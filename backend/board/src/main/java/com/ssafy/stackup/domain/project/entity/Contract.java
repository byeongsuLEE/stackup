package com.ssafy.stackup.domain.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

@Entity
@Getter
@Data
public class Contract {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column (name = "extra_condition")
    private String extraCondition;

}
