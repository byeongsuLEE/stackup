package com.ssafy.stackup.domain.recommend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

//@Entity
//@Table(name = "rocommend")
@Getter
@Setter
//@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "recommend")
public class Recommend {
    @Id
    @Field(type = FieldType.Keyword)
    @org.springframework.data.annotation.Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommend_id")
    private Long recommendId;

    @Column(nullable = false)
    @Field(type = FieldType.Text)
    private String title;

    @Column(nullable = false)
    @Field(type = FieldType.Text)
    private String description;

    @Column(nullable = false)
    @Field(type = FieldType.Text)
    private String classification;
}
