package com.ssafy.stackup.domain.recommend.entity;

import com.ssafy.stackup.domain.board.entity.BoardFramework;
import com.ssafy.stackup.domain.board.entity.BoardLanguage;
import com.ssafy.stackup.domain.board.entity.Level;
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

    @Field(type = FieldType.Keyword)
    private String classification;

    @Field(type = FieldType.Nested, includeInParent = true)
    private List<BoardFramework> frameworks;

//    @Field(type = FieldType.Nested, includeInParent = true)
//    private List<BoardLanguage> languages;
    @Field(type = FieldType.Nested, includeInParent = true)
    private List<String> languages;

    @Field(type = FieldType.Keyword)
//    @Field(type= FieldType.Nested)
    private Level level;

    private Long boardId;
}
