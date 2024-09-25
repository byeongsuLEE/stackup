import create from "zustand";

// 메시지 인터페이스 정의
interface Message {
  senderId: string;
  content: string;
  date: string;
}

// 채팅 인터페이스 정의, messages 필드 추가
export interface Chat {
  name: string;
  messagePreview: string;
  timestamp: string;
  chatId: string;
  unreadCount: number;
  messages: Message[]; // 각 채팅방의 메시지 배열
}

interface ChatState {
  chats: Chat[];
  loadChats: () => void;
  addChat: (chat: Chat) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],

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
        {
          name: "클라이언트 2",
          messagePreview: "test test test test",
          timestamp: "오후 3:54",
          chatId: "2",
          unreadCount: 50,
          messages: [
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-24",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-24",
            },
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-24",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-24",
            },
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-24",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-24",
            },
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-24",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-24",
            },
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-24",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-25",
            },
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-25",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-25",
            },
            {
              senderId: "2",
              content: "How’s the project going?",
              date: "2024-09-25",
            },
            {
              senderId: "1",
              content: "It’s going well, thank you!",
              date: "2024-09-25",
            },
          ],
        },
        {
          name: "클라이언트 3",
          messagePreview: "test test test test",
          timestamp: "오후 3:55",
          chatId: "3",
          unreadCount: 10,
          messages: [
            {
              senderId: "3",
              content: "Do you have time for a call?",
              date: "2024-09-23",
            },
          ],
        },
        {
          name: "클라이언트 4",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "4",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 5",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "5",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 6",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "6",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 7",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "7",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 8",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "8",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 9",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "9",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 10",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "10",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 11",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "11",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 12",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "12",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 13",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "13",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 14",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "14",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 15",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "15",
          unreadCount: 300,
          messages: [
            { senderId: "1", content: "Hi there!", date: "2024-09-25" },
            { senderId: "2", content: "Hello!", date: "2024-09-25" },
          ],
        },
        {
          name: "클라이언트 16",
          messagePreview: "test test test test",
          timestamp: "오후 3:53",
          chatId: "16",
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
