import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { styled } from "@mui/system";
import * as React from "react";
import ChatIcon from "../../icons/ChatIcon";
import ChatListItem from "../chat/ChatListItem";
import { useChatStore } from "../../store/ChatStore";
import { FaArrowLeft } from "react-icons/fa";
import { useUserStore } from "../../store/UserStore"; // 로그인한 유저 정보 불러오기

import MyMessageComponent from "../chat/MyMessageComponent"; // 내가 보낸 메시지 컴포넌트
import OtherMessageComponent from "../chat/OtherMessageComponent"; // 상대방이 보낸 메시지 컴포넌트
import MessageDateComponent from "../chat/MessageDateComponent"; // 메시지 날짜 컴포넌트
import ChatInputComponent from "../chat/ChatInputComponent"; // 채팅 입력창 컴포넌트

export default function SimplePopup() {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null); // 활성화된 채팅방 ID 상태
  const [newMessages, setNewMessages] = React.useState<boolean>(true); // 새 메시지 여부

  const loadChats = useChatStore((state) => state.loadChats);
  const chats = useChatStore((state) => state.chats);

  const { clientId, freelancerId } = useUserStore((state) => ({
    clientId: state.clientId,
    freelancerId: state.freelancerId,
  })); // 로그인한 유저 정보 가져오기

  React.useEffect(() => {
    // 컴포넌트가 마운트될 때 채팅 데이터를 불러옴
    loadChats();
    // 새로운 메시지 감지 (여기서는 테스트용으로 true로 설정, 실제로는 메시지 수신 로직 추가)
    setNewMessages(true);
  }, [loadChats]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
    // 메시지 창이 열리면 새 메시지 배지를 숨김
    setNewMessages(false);
  };

  const open = Boolean(anchor);
  const id = open ? "simple-popup" : undefined;

  const handleChatClick = (chatId: string) => {
    // 채팅방을 클릭했을 때 해당 채팅방의 내용을 활성화
    setActiveChatId(chatId);
    console.log(`ClientId: ${clientId}, FreelancerId: ${freelancerId}`);
  };

  const activeChat = chats.find((chat) => chat.chatId === activeChatId);

  // 날짜가 변할 때만 표시
  const shouldDisplayDate = (
    currentDate: string,
    index: number,
    messages: any[]
  ) => {
    if (index === 0) return true; // 첫 번째 메시지에는 날짜 표시
    const previousMessage = messages[index - 1];
    return currentDate !== previousMessage.date;
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        aria-describedby={id}
        type="button"
        onClick={handleClick}
        style={{ position: "relative" }}
      >
        <ChatIcon />
        {newMessages && (
          <span
            style={{
              position: "absolute",
              top: "-5px",
              right: "-1px",
              padding: "4px 8px",
              borderRadius: "100%",
              backgroundColor: "red",
              color: "white",
              fontSize: "10px",
              zIndex: 2,
            }}
          >
            New
          </span>
        )}{" "}
        {/* 새 메시지 배지 */}
      </button>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
          {/* 활성화된 채팅방이 없다면 채팅 리스트를 표시 */}
          {!activeChatId && (
            <div className="overflow-y-auto max-h-full">
              {" "}
              {/* 스크롤 추가 */}
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.chatId}
                  name={chat.name}
                  messagePreview={chat.messagePreview}
                  timestamp={chat.timestamp}
                  chatId={chat.chatId}
                  unreadCount={chat.unreadCount}
                  onClick={() => handleChatClick(chat.chatId)} // 클릭 시 채팅방 활성화
                />
              ))}
            </div>
          )}

          {/* 활성화된 채팅방이 있다면 해당 채팅방의 내용을 표시 */}
          {activeChatId && activeChat && (
            <div className="flex flex-col h-full">
              {/* 제목과 뒤로가기 버튼을 한 줄로 표시 */}
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="text-mainGreen underline"
                >
                  <FaArrowLeft />
                </button>
                <h2 className="text-lg font-bold ml-2">{activeChat.name}</h2>
              </div>

              {/* 채팅 내용 표시 및 스크롤 영역 */}
              <div className="flex-grow overflow-y-auto p-4 max-h-96">
                {activeChat.messages.map((message, index) => (
                  <div key={index}>
                    {shouldDisplayDate(
                      message.date,
                      index,
                      activeChat.messages
                    ) && <MessageDateComponent date={message.date} />}
                    {message.senderId === activeChatId ? (
                      // MyMessageComponent: 내가 보낸 메시지
                      <MyMessageComponent message={message.content} />
                    ) : (
                      // OtherMessageComponent: 상대방이 보낸 메시지
                      <OtherMessageComponent message={message.content} />
                    )}
                  </div>
                ))}
              </div>

              {/* 채팅 입력창 - 항상 하단에 고정 */}
              <div className="mt-4">
                <ChatInputComponent
                  onSendMessage={(content) => {
                    // 메시지를 전송하는 로직 추가
                    console.log("Message sent:", content);
                    // 서버로 전송하는 로직 추가 가능 (예: stomp.js를 사용하거나 API 호출)
                  }}
                />
              </div>
            </div>
          )}
        </PopupBody>
      </BasePopup>
    </div>
  );
}

// 스타일 정의
const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const PopupBody = styled("div")(
  ({ theme }) => `
  width: 400px;
  height: 520px;
  padding: 12px 16px;
  margin-right: 30px;
  margin-bottom: 20px;
  border-radius: 20px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  box-shadow: ${
    theme.palette.mode === "dark"
      ? `0px 4px 8px rgb(0 0 0 / 0.7)`
      : `0px 4px 8px rgb(0 0 0 / 0.1)`
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`
);
