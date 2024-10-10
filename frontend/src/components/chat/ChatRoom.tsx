import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { freelanceMypage } from '../../apis/UserApi';
import MyMessageComponent from './MyMessageComponent';
import OtherMessageComponent from './OtherMessageComponent';
import axios from 'axios';

const svURL = import.meta.env.VITE_SERVER_URL;

interface ChatMessage {
  userId: string | null;
  message: string;
  chatRoomId: string;
  registTime: string;
}

interface ReceiveMessage {
  userId: number | null;
  message: string;
  registTime: string;
}

interface ChatRoomProps {
  chatRoomId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatRoomId }) => {
  const [messages, setMessages] = useState<ReceiveMessage[]>([]);
  const [message, setMessage] = useState('');
  const stompClientRef = useRef<any>(null);
  const userId = sessionStorage.getItem('userId');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const connectSocket = () => {
    const sock = new SockJS(`https://stackup.live/api/user/ws`);
    stompClientRef.current = Stomp.over(sock);

    stompClientRef.current.connect({}, (frame: any) => {
      console.log('Connected: ', frame);
      stompClientRef.current.subscribe(`/topic/chatroom`, (chatMessage: any) => {
        const receivedMessage = JSON.parse(chatMessage.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    }, (error: any) => {
      console.error('STOMP Error: ', error);
      setTimeout(() => {
        console.log('Reconnecting...');
        connectSocket(); // 재연결 시도
      }, 2000); // 2초 후 재연결
    });
  };

  useEffect(() => {
    freelanceMypage();
    connectSocket(); // 소켓 연결 시도

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${svURL}/user/chat/room/${chatRoomId}`);
        console.log(response.data);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // 팝업이 열릴 때 body 스크롤 막기
    document.body.style.overflow = 'hidden';

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
      }
      // 팝업이 닫힐 때 body 스크롤 원상복구
      document.body.style.overflow = 'auto';
    };
  }, [chatRoomId]);

  const myRegistTime = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(' ', 'T');

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const chatMessage: ChatMessage = {
        userId: userId,
        message: message,
        chatRoomId: chatRoomId,
        registTime: myRegistTime
      };

      console.log('Sending message:', chatMessage);
      stompClientRef.current.send('/app/user/chatroom/send', {}, JSON.stringify(chatMessage));

      await axios.post(`${svURL}/user/chat/send`, {
        userId: userId,
        chatRoomId: chatRoomId,
        message: message,
        registTime: myRegistTime
      });

      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div>
      <div style={{ height: '350px', overflowY: 'auto', padding: '10px' }}>
        {messages.map((msg, index) => (
          msg.userId == userId ? (
            <MyMessageComponent key={index} message={msg.message} registTime={formatTime(msg.registTime)} />
          ) : (
            <OtherMessageComponent key={index} message={msg.message} registTime={formatTime(msg.registTime)} />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className='mt-1'>
        <input
          type="text"
          value={message}
          className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력해주세요"
          style={{ width: '80%', padding: '10px', marginTop: '10px' }}
        />
        <button
          onClick={sendMessage}
          className="bg-mainGreen text-white py-2 px-4 rounded-lg hover:bg-subGreen1"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
