import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/UserStore"; // 로그인한 유저 정보 불러오기
import { useChatStore } from "../../store/ChatStore"; // 채팅방 정보 불러오기

interface ChatStartButtonProps {
  freelancerId: number; // 상대방 유저의 ID (프리랜서)
  onChatRoomCreated: (chatRoomId: number) => void; // 채팅방 생성 시 실행할 함수
}

const ChatStartButton = ({
  freelancerId,
  onChatRoomCreated,
}: ChatStartButtonProps) => {
  const loggedInUser = useUserStore((state) => state.clientId); // 로그인한 유저 정보 가져오기
  const { loadChats, moveToChatRoom } = useChatStore(); // 채팅방 이동 또는 생성 함수
  const token = sessionStorage.getItem("token"); // 토큰 가져오기

  const [isLoading, setIsLoading] = useState(false);

  // 유저가 로그인하면 채팅방 목록을 불러옴
  useEffect(() => {
    // loggedInUser와 token이 유효할 때 loadChats 호출
    if (loggedInUser && token) {
      loadChats(Number(loggedInUser), token); // clientId와 token 전달
    }
  }, [loggedInUser, token, loadChats]);

  const handleChatButtonClick = async () => {
    if (isLoading || !loggedInUser || !token) return;

    setIsLoading(true);

    try {
      const clientId = Number(loggedInUser);
      const chatRoomId = await moveToChatRoom(clientId, freelancerId, token);

      if (chatRoomId !== null) {
        onChatRoomCreated(Number(chatRoomId)); // 채팅방 생성/이동 후 부모 컴포넌트에 전달
      }
    } catch (error) {
      console.error("채팅방 이동/생성 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleChatButtonClick}
      className="bg-mainGreen text-white w-[80px] h-[30px] rounded-lg px-2 font-bold text-sm"
      disabled={isLoading}
    >
      {isLoading ? "로딩 중..." : "채팅 시작"}
    </button>
  );
};

export default ChatStartButton;
