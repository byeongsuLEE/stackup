package com.ssafy.stackup.domain.user.entity;


import com.ssafy.stackup.domain.project.entity.Project;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.ColumnDefault;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id",  unique = true, nullable = false)
    private Long id;


    protected String name;

    protected String email;

    private String phone;

    @Column (name = "user_address")
    private String userAddress;
    @Column (name = "public_key")
    private String publicKey;

    @Column (name = "second_password")
    private String secondPassword;

    @Column (name = "account_key")
    private String accountKey;

    @Column(name = "total_score")
    private Double totalScore;

    @Column(name = "reported_count")
    private Integer reportedCount;

    @Column(name = "main_account")
    private String mainAccount;


    @ElementCollection
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    protected List<String> roles;

    public void updateEmail(String email) {
        this.email = email;
    }

    public void updateName(String name) {
        this.name = name;
    }

    public void updatePhone(String phone) {
        this.phone = phone;
    }

    public void updateSecondPassword(String secondPassword) {
        this.secondPassword = secondPassword;
    }

    public void updateTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public void updateReportedCount(Integer reportedCount) {
        this.reportedCount = reportedCount;
    }

}
