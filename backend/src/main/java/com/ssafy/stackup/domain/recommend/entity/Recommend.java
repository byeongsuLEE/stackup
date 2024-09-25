package com.ssafy.stackup.domain.recommend.entity;

import com.ssafy.stackup.domain.board.entity.BoardFramework;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "recommend")
public class Recommend {
    @Id
    @Field(type = FieldType.Keyword)
    @org.springframework.data.annotation.Id
    @Column(name = "recommend_id")
    private String recommendId;

    @Column(nullable = false)
    @Field(type = FieldType.Keyword)
    private String classification;

    @Column(nullable = false)
    @Field(type = FieldType.Nested, includeInParent = true)
    private List<BoardFramework> frameworks;
}
