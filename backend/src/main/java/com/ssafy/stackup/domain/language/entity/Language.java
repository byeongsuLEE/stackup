package com.ssafy.stackup.domain.language.entity;

import com.ssafy.stackup.domain.board.entity.Board;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.user.entity.Freelancer;
import com.ssafy.stackup.domain.user.entity.FreelancerLanguage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "language")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Language {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="language_id")
    private Long id;

    @Field(type = FieldType.Keyword)
    private String name;

//    @OneToMany(mappedBy = "language", cascade = CascadeType.ALL, orphanRemoval = true)
//    List <BoardLanguage> boardLanguages = new ArrayList<>();
//
//    @OneToMany(mappedBy = "language", cascade = CascadeType.ALL, orphanRemoval = true)
//    List <FreelancerLanguage> freelancerLanguages = new ArrayList<>();
}
