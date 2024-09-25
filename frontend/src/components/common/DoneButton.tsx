import React from "react";
import { useUserStore } from "../../store/UserStore"; // 로그인한 유저 정보 불러오기

interface ButtonProps {
  height: number;
  width: number;
  title: string;
  freelancerId?: string; // 상대방 유저의 ID (프리랜서)를 선택적으로 변경
}

const DoneButton = ({ height, width, title, freelancerId }: ButtonProps) => {
  const loggedInUser = useUserStore((state) => state.clientId); // 로그인한 유저 정보 가져오기

  const handleChatButtonClick = () => {
    if (freelancerId) {
      console.log(`ClientId: ${loggedInUser}, FreelancerId: ${freelancerId}`);
    } else {
      console.log(`ClientId: ${loggedInUser}, No FreelancerId provided`);
    }
    // 채팅 시작 로직 추가 가능
  };

  return (
    <button
      style={{ height, width }}
      onClick={handleChatButtonClick}
      className="bg-mainGreen text-white rounded-lg px-2 font-bold text-sm"
    >
      {title}
    </button>
  );
};

export default DoneButton;
