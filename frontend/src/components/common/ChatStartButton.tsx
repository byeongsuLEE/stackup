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
