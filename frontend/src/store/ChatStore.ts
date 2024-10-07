// import { create } from "zustand";

// interface Message {
//   senderId: string;
//   content: string;
//   date: string;
// }

// export interface Chat {
//   name: string;
//   messagePreview: string;
//   timestamp: string;
//   chatId: string;
//   unreadCount: number;
//   messages: Message[];
// }

// export interface ChatState {
//   chats: Chat[]; // 유저가 참여 중인 채팅방 목록
//   activeChatId: string | null;
//   setActiveChatId: (chatId: string | null) => void;
//   loadChats: (clientId: number, token: string) => Promise<void>; // 유저의 채팅방 목록을 서버에서 불러옴
//   addChat: (chat: Chat) => void;
//   moveToOrCreateChatRoom: (
//     clientId: number,
//     freelancerId: number,
//     token: string
//   ) => Promise<string | number | null>; // 채팅방 생성 또는 이동
// }

// export const useChatStore = create<ChatState>((set, get) => ({
//   chats: [],
//   activeChatId: null,

//   setActiveChatId: (chatId: string | null) => set({ activeChatId: chatId }),

//   loadChats: async (clientId, token) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8080/api/chatroom/${clientId}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to load chatrooms. Status: ${response.status}`);
//       }

//       const result = await response.json();
//       const userChatRooms: Chat[] = result.data;

//       console.log("유저가 참여 중인 채팅방 목록:", userChatRooms);

//       set({ chats: userChatRooms }); // 채팅방 목록을 스토어에 저장
//     } catch (error) {
//       console.error("Failed to load chats:", error);
//     }
//   },

//   addChat: (chat: Chat) =>
//     set((state) => ({
//       chats: [...state.chats, chat],
//     })),

//   moveToOrCreateChatRoom: async (
//     clientId: number,
//     freelancerId: number,
//     token: string
//   ) => {
//     const { chats, addChat, setActiveChatId } = get();

//     // 채팅방 목록에서 freelancerId와 매칭되는 채팅방이 있는지 확인
//     const existingChat = chats.find(
//       (chatRoom) =>
//         chatRoom.name === `Client ${clientId} - Freelancer ${freelancerId}`
//     );

//     if (existingChat) {
//       console.log("이미 존재하는 채팅방:", existingChat.chatId);
//       setActiveChatId(existingChat.chatId);
//       return existingChat.chatId;
//     }

//     console.log("새로운 채팅방 생성 요청 중...");

//     const createChatResponse = await fetch(
//       "http://localhost:8080/api/chatroom/start",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ clientId, freelancerId }),
//       }
//     );

//     if (!createChatResponse.ok) {
//       throw new Error(
//         `Failed to start chat. Status: ${createChatResponse.status}`
//       );
//     }

//     const createChatResult = await createChatResponse.json();
//     const chatRoomId = createChatResult.data.chatRoomId;

//     console.log("새로 생성된 채팅방 ID:", chatRoomId);

//     addChat({
//       name: `Client ${clientId} - Freelancer ${freelancerId}`,
//       messagePreview: "",
//       timestamp: new Date().toISOString(),
//       chatId: chatRoomId,
//       unreadCount: 0,
//       messages: [],
//     });

//     setActiveChatId(chatRoomId);
//     return chatRoomId;
//   },
// }));

// 제발
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
  clientId: string;
  freelancerId: string; // 추가된 필드
  unreadCount: number;
  messages: Message[];
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (chatId: string | null) => void;
  loadChats: (clientId: number, token: string) => Promise<void>;
  addChat: (chat: Chat) => void;
  moveToChatRoom: (
    clientId: number,
    freelancerId: number,
    token: string
  ) => Promise<string>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  activeChatId: null,

  setActiveChatId: (chatId: string | null) => set({ activeChatId: chatId }),

  loadChats: async (clientId: number, token: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/chatroom/${clientId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load chatrooms. Status: ${response.status}`);
      }

      const result = await response.json();
      const userChatRooms: Chat[] = result.data;

      console.log("User's chat rooms:", userChatRooms);

      set({ chats: userChatRooms });
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  },

  addChat: (chat: Chat) =>
    set((state) => ({
      chats: [...state.chats, chat],
    })),

  moveToChatRoom: async (
    clientId: number,
    freelancerId: number,
    token: string
  ) => {
    const { chats, addChat, setActiveChatId } = get();

    try {
      const existingChat = chats.find(
        (chatRoom: Chat) =>
          chatRoom.clientId === String(clientId) &&
          chatRoom.freelancerId === String(freelancerId)
      );

      if (existingChat) {
        console.log("Existing chat room found:", existingChat.chatId);
        setActiveChatId(existingChat.chatId);
        return existingChat.chatId;
      }

      console.log("Creating new chat room...");

      const createChatResponse = await fetch(
        "http://localhost:8080/api/chatroom/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ clientId, freelancerId }),
        }
      );

      if (!createChatResponse.ok) {
        throw new Error(
          `Failed to start chat. Status: ${createChatResponse.status}`
        );
      }

      const createChatResult = await createChatResponse.json();
      const chatRoomId: string = createChatResult.data.chatRoomId;

      console.log("New chat room created with ID:", chatRoomId);

      const newChat: Chat = {
        name: `채팅방 ${chatRoomId}`,
        messagePreview: "새로운 채팅방이 생성되었습니다.",
        timestamp: new Date().toLocaleTimeString(),
        chatId: chatRoomId,
        clientId: String(clientId),
        freelancerId: String(freelancerId), // 이 부분이 추가되었습니다
        unreadCount: 0,
        messages: [],
      };

      addChat(newChat);
      setActiveChatId(chatRoomId);
      return chatRoomId;
    } catch (error) {
      console.error("Error creating or moving to chat room:", error);
      throw error;
    }
  },
}));
