import { projectApplicantProps } from "../../apis/Board.type";
import ChatStartButton from "../common/ChatStartButton";
import DoneButton from "../common/DoneButton";
import React, { useState } from "react";
import { useChatStore } from "../../store/ChatStore"; // ChatStore에서 addChat 사용
import { useUserStore } from "../../store/UserStore"; // clientId 가져오기

const Candidate = ({
  name,
  portfolioUrl,
  totalScore,
  id,
}: projectApplicantProps) => {
  const [activeChatRoomId, setActiveChatRoomId] = useState<number | null>(null);
  const chats = useChatStore((state) => state.chats); // 현재 채팅방 목록 가져오기

  // 채팅방 생성 시 실행할 함수
  const handleChatRoomCreated = (chatRoomId: number) => {
    console.log("새로운 채팅방 생성됨:", chatRoomId);
    setActiveChatRoomId(chatRoomId);
  };

  return (
    <tr>
      <td>
        <div className="form-control">
          <label className="cursor-pointer label">
            <input type="checkbox" className="checkbox checkbox-success" />
          </label>
        </div>
      </td>
      <td>{name}</td>
      <td>{totalScore}</td>
      <td>
        <a href={portfolioUrl}>{portfolioUrl}</a>
      </td>
      <td className="flex justify-center mt-1.5">
        <div className="mr-3">
          <DoneButton width={60} height={30} title="프로필" />
        </div>

        {/* ChatStartButton에 handleChatRoomCreated 전달 */}
        <ChatStartButton
          freelancerId={id}
          onChatRoomCreated={handleChatRoomCreated}
        />
      </td>
    </tr>
  );
};

export default Candidate;
