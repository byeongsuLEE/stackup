package com.ssafy.stackup.domain.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@SuperBuilder
@DiscriminatorValue("Freelancer")
public class Freelancer extends User {


    //github id
    @Column(name = "github_id", unique = true, nullable = false)
    private String githubId;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "self_introduction")
    private String selfIntroduction;

    private String address;


    @Column(name = "career_year")
    private Integer careerYear;

    //대분류 (모바일, 웹)
    private String classification;



    @OneToMany(mappedBy = "freelancer", cascade = CascadeType.ALL ,  orphanRemoval = true)
    @ToString.Exclude
    private Set<FreelancerLanguage> languages ;

    @OneToMany(mappedBy = "freelancer",cascade = CascadeType.ALL , orphanRemoval = true)
    @ToString.Exclude
    private Set<FreelancerFramework> frameworks;

    @OneToMany(mappedBy = "freelancer", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    Set<FreelancerProject> freelancerProjects;

    public void updateGithubId(String githubId) {
        this.githubId = githubId;
    }

    public void updatePortfolioUrl(String portfolioUrl) {
        this.portfolioUrl = portfolioUrl;
    }



    public void updateSelfIntroduction(String selfIntroduction) {
        this.selfIntroduction = selfIntroduction;
    }

    public void updateAddress(String address) {
        this.address = address;
    }


    public void updateCareerYear(Integer careerYear) {
        this.careerYear = careerYear;
    }

    public void updateClassification(String classification) {
        this.classification = classification;
    }


    public void updateRoles(List<String> roles) {
        this.roles = roles;
    }

    public void updateFreelancerLanguages(Set<FreelancerLanguage> languages) {
        this.languages.clear();
        this.languages.addAll(languages);
    }

    public void updateFreelancerFrameworks(Set<FreelancerFramework> frameworks) {
        this.frameworks.clear();
        this.frameworks.addAll(frameworks);
    }


}
