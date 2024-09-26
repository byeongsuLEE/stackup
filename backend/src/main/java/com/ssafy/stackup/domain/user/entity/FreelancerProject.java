package com.ssafy.stackup.domain.user.entity;


import com.ssafy.stackup.domain.project.entity.Project;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch =FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Freelancer freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "freelancer_signed")
    private boolean freelancerSigned;

    @Column (name = "client_signed")
    private boolean clientSigned;

    @Column(name = "nft_contract_url")
    private String nftContractUrl;

    @Column(name = "nft_contract_hash")
    private String nftContractHash;  // NFT 계약서의 해시값

    @Column(name = "nft_certificate_url")
    private String nftCertificateUrl;

    @Column(name = "nft_certificate_hash")
    private String nftCertificateHash;  // 경력 증명서의 해시값

    public void setFreelancerSigned(boolean freelancerSigned) {
        this.freelancerSigned = freelancerSigned;
    }

    public void setClientSigned(boolean clientSigned) {
        this.clientSigned = clientSigned;
    }

}
