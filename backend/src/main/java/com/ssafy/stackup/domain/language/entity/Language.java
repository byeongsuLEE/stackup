package com.ssafy.stackup.domain.language.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

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
