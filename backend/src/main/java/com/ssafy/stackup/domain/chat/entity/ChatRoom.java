package com.ssafy.stackup.domain.chat.entity;

import com.ssafy.stackup.domain.user.entity.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatroom_id", nullable = false)
    private Long id;

    // ChatRoom에 참여한 두 명의 사용자
    @ManyToOne
    @JoinColumn(name ="client_id", nullable = false)
    private User client;

    @ManyToOne
    @JoinColumn(name ="freelancer_id", nullable = false)
    private User freelancer;

    @OneToMany(mappedBy = "chatRoom" , cascade = CascadeType.ALL ,orphanRemoval = true)
    private List<Chat> chats = new ArrayList<>();
}















