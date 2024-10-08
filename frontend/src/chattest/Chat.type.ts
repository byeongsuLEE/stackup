export interface ChatDto {
    chatroomId: number;
    receiverId: number;
    message: string;
    registTime: string;
}

export interface ChatRoomInfoResponseDto {
    chatRoomId: number;
    clientId: number;
    freelancerId: number;
    chats: ChatDto[];
    previewChat: string;
}

export interface ChatMessage {
    sender: string;  // 메시지를 보낸 사람의 ID
    content: string; // 메시지 내용
    chatRoomId: number; // 채팅방 ID
}
