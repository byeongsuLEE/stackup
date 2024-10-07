package com.ssafy.stackup.domain.recommend.entity;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "apply")
public class Apply {

    @jakarta.persistence.Id
    @Field(type = FieldType.Keyword)
    @org.springframework.data.annotation.Id
    @Column(name="apply_id")
    private String applyId;
}
