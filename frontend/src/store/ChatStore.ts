import { create } from "zustand";

interface Message {
  senderId: string;
  content: string;
  date: string;
}

export interface Chat {
  name: string;
  messagePreview: string;
  timestamp: string;
  chatId: string;
  unreadCount: number;
  messages: Message[];
}
export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
  loadChats: () => void;
  addChat: (chat: Chat) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

  activeChatId: null,

  setActiveChatId: (chatId) => set({ activeChatId: chatId }),

  // 채팅 데이터를 로드하는 함수 (더미 데이터 포함)
  loadChats: () =>
    set(() => ({
      chats: [
        {
          name: "클라이언트 1",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "1",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
      ],
    })),

  // 새로운 채팅을 추가하는 함수
  addChat: (chat: Chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),
}));
