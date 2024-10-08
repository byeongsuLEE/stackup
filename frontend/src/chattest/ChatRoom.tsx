import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'; // URL 파라미터를 가져오기 위해 사용
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { freelanceStore } from '../store/FreelanceStore';
import { freelanceMypage } from '../apis/UserApi';
import MyMessageComponent from '../components/chat/MyMessageComponent';
import OtherMessageComponent from '../components/chat/OtherMessageComponent';
import axios from 'axios';

// 채팅 메시지 인터페이스 정의
interface ChatMessage {
  userId: string | null;
  message: string;
  chatRoomId: string;
}

interface ReceiveMessage {
  userId: number | null;
  message: string;
}

interface ChatRoomProps {
  chatRoomId: string; // chatRoomId의 타입 정의
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoomId }) => {
  // const { chatRoomId } = useParams<{ chatRoomId: string }>();// URL에서 chatRoomId 파라미터를 가져옴
  console.log(chatRoomId)
  const [messages, setMessages] = useState<ReceiveMessage[]>([]); // 메시지 목록 상태
  const [message, setMessage] = useState(''); // 입력된 메시지 상태
  const stompClientRef = useRef<any>(null); // STOMP 클라이언트 참조 변수
  const userId = sessionStorage.getItem('userId')


  useEffect(() => {
    freelanceMypage();
    const sock = new SockJS('http://localhost:8080/api/ws'); // WebSocket 엔드포인트 설정
    stompClientRef.current = Stomp.over(sock);
    stompClientRef.current.connect({}, (frame: any) => {

      stompClientRef.current.subscribe(`/topic/chatroom`, (chatMessage: any) => {
        const receivedMessage = JSON.parse(chatMessage.body); // 받은 메시지를 JSON으로 변환
        setMessages((prevMessages) => [...prevMessages, receivedMessage]); // 받은 메시지를 기존 메시지 배열에 추가
      });
    }, (error) => {
      console.error('STOMP Error: ', error); // 연결 실패 시 에러 로그 출력
    });

     // 채팅 메시지 불러오기
     const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/chat/room/${chatRoomId}`);
        console.log(response.data)
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages(); // 컴포넌트 마운트 시 메시지 불러오기
    console.log('메시지 : ',messages)

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      stompClientRef.current.disconnect();
    };
  }, [chatRoomId]);

  // const name = freelanceStore((state) => state.name);
  
  // 메시지 전송 함수
  const sendMessage = async () => {
    if (message.trim() !== '') {
      const chatMessage: ChatMessage = {
        userId: userId,
        message: message,
        chatRoomId: chatRoomId,
      };

      console.log('Sending message:', chatMessage);

      // STOMP 클라이언트를 통해 메시지 전송
      stompClientRef.current.send('/app/chatroom/send', {}, JSON.stringify(chatMessage));
      
      await axios.post('http://localhost:8080/api/chat/send', {
        userId: userId,
        chatRoomId: chatRoomId,
        message: message,
      });

      setMessage(''); // 메시지 입력란 초기화
    }
  };

  return (
    <div>
      {/* <h2>채팅방 {chatRoomId}</h2> */}
      <div style={{ height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, index) => {
          // 보낸 메시지인지 상대 메시지인지 확인하여 해당 컴포넌트 렌더링
          return msg.userId == userId ? (
            <MyMessageComponent key={index} message={msg.message} />
          ) : (
            <OtherMessageComponent key={index} message={msg.message} />
          );
        })}
      </div>
      <div className='mt-1'>
        <input
          type="text"
          value={message}
          className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력해주세요..."
          style={{ width: '80%', padding: '10px', marginTop: '10px' }}
        />
        <button
          onClick={sendMessage}
          className="bg-mainGreen text-white py-2 px-4 rounded-lg hover:bg-subGreen1"
        >
          전송
        </button>

      </div>
      {/* <button onClick={sendMessage} style={{ padding: '10px', marginLeft: '10px' }}>Send</button> */}
    </div>
  );
};

export default ChatRoom;
