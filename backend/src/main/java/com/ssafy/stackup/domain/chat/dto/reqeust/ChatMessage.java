package com.ssafy.stackup.domain.chat.dto.reqeust;

import lombok.Data;

@Data
public class ChatMessage {
    private Long userId;
    private String message;
    private String chatRoomId;
}
