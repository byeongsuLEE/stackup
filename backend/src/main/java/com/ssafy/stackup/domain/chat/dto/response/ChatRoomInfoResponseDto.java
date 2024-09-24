package com.ssafy.stackup.domain.chat.dto.response;

import com.ssafy.stackup.domain.chat.entity.Chat;
import com.ssafy.stackup.domain.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 작성자   : user
 * 작성날짜 : 2024-09-25
 * 설명    :
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ChatRoomInfoResponseDto {
    private Long chatRoomId;

    private Long clientId;

    private Long freelancerId;
    private List<Chat> chats ;


}
