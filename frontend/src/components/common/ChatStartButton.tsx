// import React from "react";
// import { useUserStore } from "../../store/UserStore"; // 로그인한 유저 정보 불러오기

// interface ChatStartButtonProps {
//   freelancerId: number; // 상대방 유저의 ID (프리랜서)
// }
// const ChatStartButton = ({ freelancerId }: ChatStartButtonProps) => {
//   const loggedInUser = useUserStore((state) => state.clientId); // 로그인한 유저 정보 가져오기

//   const handleChatButtonClick = () => {
//     console.log(`ClientId: ${loggedInUser}, FreelancerId: ${freelancerId}`);
//     // 채팅 시작 로직 추가 가능
//   };

//   return (
//     <button
//       onClick={handleChatButtonClick}
//       className="bg-mainGreen text-white w-[80px] h-[30px] rounded-lg px-2 font-bold text-sm"
//     >
//       채팅 시작
//     </button>
//   );
// };

// export default ChatStartButton;

import React from "react";
import { useChatStore } from "../../store/ChatStore"; // 상태 관리를 위한 Store 사용
import { useUserStore } from "../../store/UserStore"; // 로그인한 유저 정보 불러오기

interface ChatStartButtonProps {
  freelancerId: number; // 상대방 유저의 ID (프리랜서)
}
const ChatStartButton = ({ freelancerId }: ChatStartButtonProps) => {
  const loggedInUser = useUserStore((state) => state.clientId); // 로그인한 유저 정보 가져오기
  const { addChat, setActiveChatId } = useChatStore(); // 채팅방 추가 및 활성화

  const handleChatButtonClick = async () => {
    console.log(`ClientId: ${loggedInUser}, FreelancerId: ${freelancerId}`);

    try {
      const response = await fetch("http://localhost:8080/api/chatroom/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 토큰 가져오기
        },
        body: JSON.stringify({
          clientId: loggedInUser,
          freelancerId: freelancerId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start chat. Status: ${response.status}`);
      }

      const result = await response.json();
      const chatRoomId = result.data.chatRoomId;

      // 새로운 채팅방 추가 및 활성화
      addChat({
        name: `프리랜서 ${freelancerId}`, // 예시로 프리랜서 이름 설정
        messagePreview: "",
        timestamp: new Date().toISOString(),
        chatId: chatRoomId.toString(),
        unreadCount: 0,
        messages: [],
      });

      setActiveChatId(chatRoomId);
      console.log(`채팅방 생성됨: ${chatRoomId}`);
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
    }
  };

  return (
    <button
      onClick={handleChatButtonClick}
      className="bg-mainGreen text-white w-[80px] h-[30px] rounded-lg px-2 font-bold text-sm"
    >
      채팅 시작
    </button>
  );
};

export default ChatStartButton;
