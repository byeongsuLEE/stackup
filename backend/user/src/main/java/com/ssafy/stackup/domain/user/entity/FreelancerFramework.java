package com.ssafy.stackup.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.stackup.domain.framework.entity.Framework;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FreelancerFramework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "freelancer_framework_id", unique = true, nullable = false)
    private Long id;

    @ManyToOne(fetch =  FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    @JsonIgnore
    private Freelancer freelancer ;

    @ManyToOne(fetch  = FetchType.LAZY)
    @JoinColumn(name = "framework_id" , nullable = false)
    @JsonIgnore
    private Framework framework ;



}
