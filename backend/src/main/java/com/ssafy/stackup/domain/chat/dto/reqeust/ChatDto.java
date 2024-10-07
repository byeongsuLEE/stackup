package com.ssafy.stackup.domain.chat.dto.reqeust;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatDto {
    private Long chatroomId;
    private Long sendId;
    private Long receiverId;
    private String registTime;
    private String message;
}
