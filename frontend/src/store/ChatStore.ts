import { create } from 'zustand'
import { client } from '../components/common/ChatPopup';

// 채팅 인터페이스 정의, messages 필드 추가
export interface Chat {
  name: string;
  chatId: string;
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
      })),
    })),

  // 새로운 채팅을 추가하는 함수
  addChat: (chat: Chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),
}));

