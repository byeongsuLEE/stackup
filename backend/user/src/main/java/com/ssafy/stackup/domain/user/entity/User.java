package com.ssafy.stackup.domain.user.entity;


import com.ssafy.stackup.domain.evaluation.entity.Evaluation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

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

    private String userAddress;
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

    @Column(name= "evaluated_count")
    private Integer evaluatedCount;


    @ElementCollection
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    protected List<String> roles;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    protected Set<Evaluation> evaluations;

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
        this.evaluatedCount++;
    }

    public void updateAddress(String address){
        this.userAddress = address;
    }

    public void updatePublicKey(String publicKey){
        this.publicKey = publicKey;
    }

    public void updateAcountKey(String accountKey){
        this.accountKey = accountKey;
    }


    public void updateReportedCount(Integer reportedCount) {
        this.reportedCount = reportedCount;
    }

    // 특정 역할이 있는지 확인하는 메서드
    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }

    public boolean isFreelancer() {
        return hasRole("ROLE_FREELANCER");
    }

    public boolean isClient() {
        return hasRole("ROLE_CLIENT");
    }

    public void updateMainAccount(String mainAccount) {
        this.mainAccount = mainAccount;
    }
}
