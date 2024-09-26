package com.ssafy.stackup.domain.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.stackup.domain.language.entity.Language;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "freelancer_language_id" , unique = true, nullable = false)
    Long id ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id" , nullable = false)
    @JsonIgnore
    Freelancer freelancer ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="language_id" , nullable = false)
    @JsonIgnore
    Language language ;
}
