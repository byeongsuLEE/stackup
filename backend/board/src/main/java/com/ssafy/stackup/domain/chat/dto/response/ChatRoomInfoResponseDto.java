package com.ssafy.stackup.domain.chat.dto.response;

import com.ssafy.stackup.domain.chat.entity.Chat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    private String previewChat;

    public String setPreviewChat() {
       return this.previewChat = (this.chats != null && !this.chats.isEmpty())? chats.get(chats.size()-1).getMessage():" 채팅이 없습니다" ;
    }



}
