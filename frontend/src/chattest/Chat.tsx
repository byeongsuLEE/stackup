import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// 채팅 메시지 인터페이스 정의
export interface ChatMessage {
  sender: string;
  content: string;
  chatRoomId: number;
}

const Chat: React.FC<{ chatRoomId: number; userId: string }> = ({ chatRoomId, userId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // 메시지 목록 상태
  const [message, setMessage] = useState(''); // 입력된 메시지 상태
  const stompClientRef = useRef<any>(null); // STOMP 클라이언트 참조 변수

  // WebSocket 연결 및 구독 설정
  useEffect(() => {
    console.log(chatRoomId)
    const sock = new SockJS('http://localhost:8080/ws'); // WebSocket 엔드포인트 설정
    stompClientRef.current = Stomp.over(sock);

    stompClientRef.current.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);

      // 특정 채팅방의 메시지를 구독
      stompClientRef.current.subscribe(`/topic/chatroom/${chatRoomId}`, (chatMessage: any) => {
        const receivedMessage = JSON.parse(chatMessage.body); // 받은 메시지를 JSON으로 변환
        setMessages((prevMessages) => [...prevMessages, receivedMessage]); // 받은 메시지를 기존 메시지 배열에 추가
      });
    });

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      stompClientRef.current.disconnect();
    };
  }, [chatRoomId]);

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim() !== '') {
      const chatMessage: ChatMessage = {
        sender: userId,
        content: message,
        chatRoomId: chatRoomId,
      };

      // STOMP 클라이언트를 통해 메시지 전송
      stompClientRef.current.send('/app/chatroom/send', {}, JSON.stringify(chatMessage));
      setMessage(''); // 메시지 입력란 초기화
    }
  };

  return (
    <div>
      <h2>Chat Room {chatRoomId}</h2>
      <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid gray', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        style={{ width: '80%', padding: '10px', marginTop: '10px' }}
      />
      <button onClick={sendMessage} style={{ padding: '10px', marginLeft: '10px' }}>Send</button>
    </div>
  );
};

export default Chat;
