package com.ssafy.stackup.domain.user.entity;


import com.ssafy.stackup.domain.board.entity.Board;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@SuperBuilder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@DiscriminatorValue("Client")
public class Client extends User implements UserDetails {




    @Column(name = "password")
    private String password;


    @Column (name =  "business_registration_number")
    private String businessRegistrationNumber;

    @Column (name = "business_name")
    private String businessName;



    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role))
                .collect(Collectors.toList());
    }

    @Override
    public String getUsername() {
        return String.valueOf(this.getId());
    }


    //나중에 채널 추가
//    @OneToMany(cascade = CascadeType.ALL , mappedBy = "Client",fetch = FetchType.LAZY)
//    private List<Channel> channels;


    @OneToMany(cascade = CascadeType.ALL, mappedBy = "client" , fetch = FetchType.LAZY)
    private List<Board> boards;




    // 필드별 업데이트 메서드


    public void updateBusinessRegistrationNumber(String businessRegistrationNumber) {
        this.businessRegistrationNumber = businessRegistrationNumber;
    }

    public void updateBusinessName(String businessName) {
        this.businessName = businessName;
    }



}
