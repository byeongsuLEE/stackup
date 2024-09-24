package com.ssafy.stackup.domain.chat.service;


import com.ssafy.stackup.domain.chat.dto.reqeust.ChatDto;
import com.ssafy.stackup.domain.chat.dto.response.ChatResponseDto;

import java.util.List;

public interface ChatService {
    ChatDto saveChat(final ChatDto chatDto, final String token);
    List<ChatResponseDto> chatLogs(final Long ChannelId);

}
