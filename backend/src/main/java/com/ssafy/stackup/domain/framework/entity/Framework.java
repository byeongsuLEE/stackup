package com.ssafy.stackup.domain.framework.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;


@Entity
@Table(name = "framework")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Framework {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "framework_id")
    private Long id;

    @Field(type = FieldType.Keyword)
    private String name;


//    @OneToMany(mappedBy = "framework", cascade = CascadeType.ALL, orphanRemoval = true)
//    List<BoardFramework> boardFrameworks = new ArrayList<>();
//
//    @OneToMany(mappedBy = "framework", cascade = CascadeType.ALL, orphanRemoval = true)
//    List<FreelancerFramework> freelancerFrameworkList = new ArrayList<>();
}
