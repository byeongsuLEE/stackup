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
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // 명시적으로 포함한 필드만 사용
public class Recommend {
    @Id
    @Field(type = FieldType.Keyword)
    @org.springframework.data.annotation.Id
    @Column(name = "recommend_id")
    private String recommendId;

    private String title;

    @Column(nullable = false)
    private String description;

    // Elasticsearch에 벡터로 저장되는 BERT 임베딩 필드 (768 차원)
    @Field(type = FieldType.Dense_Vector, dims = 768)
    @Transient // JPA가 관리하지 않도록 설정 (Elasticsearch에서만 사용)
    private double[] descriptionVector;

    private Long deposit;

    @Field(type = FieldType.Keyword)
    private String classification;

    @Field(type = FieldType.Nested, includeInParent = true)
    private List<BoardFramework> frameworks;

    @Field(type = FieldType.Nested, includeInParent = true)
    private List<BoardLanguage> languages;

    @Field(type = FieldType.Keyword)
    private Level level;

    @EqualsAndHashCode.Include // boardId만으로 equals와 hashCode 계산
    private Long boardId;
}
