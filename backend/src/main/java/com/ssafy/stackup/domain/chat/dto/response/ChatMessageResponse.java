package com.ssafy.stackup.domain.chat.dto.response;

import com.ssafy.stackup.domain.chat.entity.Chat;
import lombok.Data;

@Data
public class ChatMessageResponse {
    private Long userId; // User ID
    private String message; // Message content

    public ChatMessageResponse() {}

    public ChatMessageResponse(Chat chat) {
        this.userId = chat.getUser().getId();
        this.message = chat.getMessage();
    }
}
