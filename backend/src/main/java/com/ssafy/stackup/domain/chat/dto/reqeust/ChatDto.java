package com.ssafy.stackup.domain.chat.dto.reqeust;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatDto {
    private Long chatroomId;
    private String name;
    private String registTime;
    private String message;
}
