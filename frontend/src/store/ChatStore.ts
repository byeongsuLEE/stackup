import { create } from 'zustand'
import { client } from '../components/common/ChatPop';

// 메시지 인터페이스 정의
interface Message {
  senderId: string;
  content: string;
  date: string;
}

// 채팅 인터페이스 정의, messages 필드 추가
export interface Chat {
  name: string;
  chatId: string;
//   messagePreview: string;
//   timestamp: string;
//   unreadCount: number;
//   messages: Message[]; // 각 채팅방의 메시지 배열
}

interface ChatState {
  chats: Chat[];
  loadChats: (clientList: client[]) => void; 
  addChat: (chat: Chat) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

  // 채팅 데이터를 로드하는 함수 (더미 데이터 포함)
  loadChats: (clientList: client[]) =>
    set(() => ({
      chats: clientList.map(clientObj => ({
        name: clientObj.title,
        chatId: `${clientObj.client.id}_${clientObj.boardId}`, // 클라이언트 ID를 chatId로 사용
        // messagePreview: "New message", // 기본 프리뷰
        // timestamp: new Date().toLocaleTimeString(), // 현재 시간
        // unreadCount: 0, // 기본값
        // messages: [], // 초기에는 메시지 없음
      })),
    })),

  // 새로운 채팅을 추가하는 함수
  addChat: (chat: Chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),
}));
