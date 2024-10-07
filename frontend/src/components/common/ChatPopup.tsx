// import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
// import { styled } from "@mui/system";
// import * as React from "react";
// import ChatIcon from "../../icons/ChatIcon";
// import ChatListItem from "../chat/ChatListItem";
// import { useChatStore } from "../../store/ChatStore";
// import { FaArrowLeft } from "react-icons/fa";
// import { useUserStore } from "../../store/UserStore";
// import { Stomp } from "@stomp/stompjs";
// import MyMessageComponent from "../chat/MyMessageComponent";
// import OtherMessageComponent from "../chat/OtherMessageComponent";
// import MessageDateComponent from "../chat/MessageDateComponent";
// import ChatInputComponent from "../chat/ChatInputComponent";

// export default function SimplePopup() {
//   const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
//   const [activeChatId, setActiveChatId] = React.useState<
//     number | string | null
//   >(null);
//   const [newMessages, setNewMessages] = React.useState<boolean>(true);
//   const [messages, setMessages] = React.useState<any[]>([]);
//   const [inputValue, setInputValue] = React.useState("");
//   const stompClient = React.useRef<any>(null);

//   const loadChats = useChatStore((state) => state.loadChats);
//   const chats = useChatStore((state) => state.chats);

//   const { clientId, freelancerId } = useUserStore((state) => ({
//     clientId: Number(state.clientId),
//     freelancerId: state.freelancerId,
//   }));

//   const token = sessionStorage.getItem("token");

//   React.useEffect(() => {
//     if (clientId && token) {
//       loadChats(clientId, token); // clientId와 token을 전달
//     }
//   }, [clientId, token, loadChats]);

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchor(anchor ? null : event.currentTarget);
//     setNewMessages(false);
//   };

//   const open = Boolean(anchor);
//   const id = open ? "simple-popup" : undefined;

//   const connectWebSocket = (chatRoomId: number) => {
//     const socketFactory = () => new WebSocket("ws://localhost:8080/api/ws");
//     stompClient.current = Stomp.over(socketFactory);

//     stompClient.current.connect(
//       { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
//       function (frame: any) {
//         console.log("Connected: " + frame);

//         stompClient.current.subscribe(
//           `/sub/chatroom/${chatRoomId}`,
//           function (messageOutput: any) {
//             const message = JSON.parse(messageOutput.body);
//             console.log("수신된 메시지:", message);
//             setMessages((prevMessages) => [...prevMessages, message]);
//           },
//           { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
//         );
//       },
//       function (error: any) {
//         console.error("WebSocket 연결 실패:", error);
//       }
//     );
//   };

//   const sendMessage = () => {
//     if (stompClient.current && inputValue) {
//       const messageObj = {
//         senderId: clientId,
//         receiverId: freelancerId,
//         chatRoomId: activeChatId,
//         content: inputValue,
//       };
//       stompClient.current.send(
//         "/pub/message",
//         {
//           Authorization: `Bearer ${sessionStorage.getItem("token")}`, // 헤더에 JWT 토큰 포함
//         },
//         JSON.stringify(messageObj)
//       );
//       setInputValue("");
//     }
//   };

//   const shouldDisplayDate = (
//     currentDate: string,
//     index: number,
//     messages: any[]
//   ) => {
//     if (index === 0) return true;
//     const previousMessage = messages[index - 1];
//     return currentDate !== previousMessage.date;
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <button
//         aria-describedby={id}
//         type="button"
//         onClick={handleClick}
//         style={{ position: "relative" }}
//       >
//         <ChatIcon />
//         {newMessages && (
//           <span
//             style={{
//               position: "absolute",
//               top: "-5px",
//               right: "-1px",
//               padding: "4px 8px",
//               borderRadius: "100%",
//               backgroundColor: "red",
//               color: "white",
//               fontSize: "10px",
//               zIndex: 2,
//             }}
//           >
//             New
//           </span>
//         )}
//       </button>
//       <BasePopup id={id} open={open} anchor={anchor}>
//         <PopupBody>
//           {!activeChatId && (
//             <div className="overflow-y-auto max-h-full">
//               {chats.map((chat) => (
//                 <ChatListItem
//                   key={chat.chatId}
//                   name={chat.name}
//                   messagePreview={chat.messagePreview}
//                   timestamp={chat.timestamp}
//                   chatId={chat.chatId}
//                   unreadCount={chat.unreadCount}
//                   onClick={() => {
//                     setActiveChatId(chat.chatId);
//                     connectWebSocket(Number(chat.chatId));
//                   }}
//                 />
//               ))}
//             </div>
//           )}

//           {activeChatId && (
//             <div className="flex flex-col h-full">
//               <div className="flex items-center mb-4">
//                 <button
//                   onClick={() => setActiveChatId(null)}
//                   className="text-mainGreen underline"
//                 >
//                   <FaArrowLeft />
//                 </button>
//                 <h2 className="text-lg font-bold ml-2">
//                   채팅방 {activeChatId}
//                 </h2>
//               </div>

//               <div className="flex-grow overflow-y-auto p-4 max-h-96">
//                 {messages.map((message, index) => (
//                   <div key={index}>
//                     {shouldDisplayDate(message.timestamp, index, messages) && (
//                       <MessageDateComponent date={message.timestamp} />
//                     )}
//                     {message.senderId === clientId ? (
//                       <MyMessageComponent message={message.content} />
//                     ) : (
//                       <OtherMessageComponent message={message.content} />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-4">
//                 <ChatInputComponent
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onSend={sendMessage}
//                 />
//               </div>
//             </div>
//           )}
//         </PopupBody>
//       </BasePopup>
//     </div>
//   );
// }

// // 스타일 정의
// const grey = {
//   50: "#F3F6F9",
//   100: "#E5EAF2",
//   200: "#DAE2ED",
//   300: "#C7D0DD",
//   400: "#B0B8C4",
//   500: "#9DA8B7",
//   600: "#6B7A90",
//   700: "#434D5B",
//   800: "#303740",
//   900: "#1C2025",
// };

// const PopupBody = styled("div")(
//   ({ theme }) => `
//   width: 400px;
//   height: 520px;
//   padding: 12px 16px;
//   margin-right: 30px;
//   margin-bottom: 20px;
//   border-radius: 20px;
//   border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
//   background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
//   box-shadow: ${
//     theme.palette.mode === "dark"
//       ? "0px 4px 8px rgb(0 0 0 / 0.7)"
//       : "0px 4px 8px rgb(0 0 0 / 0.1)"
//   };
//   font-family: 'IBM Plex Sans', sans-serif;
//   font-weight: 500;
//   font-size: 0.875rem;
//   z-index: 1;
// `
// );

// ㅔ제발,,,
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { styled } from "@mui/system";
import * as React from "react";
import ChatIcon from "../../icons/ChatIcon";
import ChatListItem from "../chat/ChatListItem";
import { useChatStore } from "../../store/ChatStore";
import { FaArrowLeft } from "react-icons/fa";
import { useUserStore } from "../../store/UserStore";
import { Stomp } from "@stomp/stompjs";
import MyMessageComponent from "../chat/MyMessageComponent";
import OtherMessageComponent from "../chat/OtherMessageComponent";
import MessageDateComponent from "../chat/MessageDateComponent";
import ChatInputComponent from "../chat/ChatInputComponent";

export default function SimplePopup() {
  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);
  const [activeChatId, setActiveChatId] = React.useState<
    number | string | null
  >(null);
  const [activeFreelancerId, setActiveFreelancerId] = React.useState<
    number | null
  >(null); // 프리랜서 ID 상태 추가
  const [newMessages, setNewMessages] = React.useState<boolean>(true);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const stompClient = React.useRef<any>(null);

  const loadChats = useChatStore((state) => state.loadChats);
  const chats = useChatStore((state) => state.chats);

  const { clientId } = useUserStore((state) => ({
    clientId: Number(state.clientId),
  }));

  const token = sessionStorage.getItem("token");

  // 채팅방 목록 로딩
  React.useEffect(() => {
    if (clientId && token) {
      console.log("Loading chats for clientId:", clientId);
      loadChats(clientId, token); // clientId와 token을 전달
    }
  }, [clientId, token, loadChats]);

  // 버튼 클릭 핸들러
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(anchor ? null : event.currentTarget);
    setNewMessages(false);
  };

  const open = Boolean(anchor);
  const id = open ? "simple-popup" : undefined;

  // WebSocket 연결 함수
  const connectWebSocket = (chatRoomId: number) => {
    if (!chatRoomId) {
      console.error("Invalid chatRoomId:", chatRoomId);
      return;
    }

    // WebSocket 연결 설정
    const socketFactory = () => new WebSocket("ws://localhost:8080/api/ws");
    stompClient.current = Stomp.over(socketFactory);

    // WebSocket 연결
    stompClient.current.connect(
      { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      function (frame: any) {
        console.log("Connected: " + frame);

        // 서버에서 메시지 수신
        stompClient.current.subscribe(
          `/sub/chatroom/${chatRoomId}`,
          function (messageOutput: any) {
            const message = JSON.parse(messageOutput.body);
            console.log("Received message:", message);

            // 수신된 메시지를 로그로 출력하고 messages 배열에 추가
            setMessages((prevMessages) => {
              console.log("현재 메시지 배열:", [...prevMessages, message]);
              return [...prevMessages, message];
            });
          },
          { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        );
      },
      function (error: any) {
        console.error("WebSocket connection failed:", error);
      }
    );

    // WebSocket 연결 끊김 감지
    stompClient.current.onclose = function () {
      console.error("WebSocket 연결이 끊어졌습니다.");
    };
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (stompClient.current && inputValue && activeFreelancerId) {
      const messageObj = {
        sendId: clientId, // 메시지를 보낸 사람 (로그인한 사용자)
        receiverId: activeFreelancerId, // 메시지를 받을 사람 (프리랜서)
        chatroomId: activeChatId, // 해당 채팅방 ID
        message: inputValue, // 메시지 내용
        registTime: new Date().toISOString() // 
      };


      // 메시지 전송
      stompClient.current.send(
        "/pub/message",
        {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        JSON.stringify(messageObj)
      );

      console.log("전송된 메시지:", messageObj); // 전송된 메시지 로그 출력
      setInputValue(""); // 입력 필드 초기화
    }
  };

  // 메시지 날짜 표시 여부 확인
  const shouldDisplayDate = (
    currentDate: string,
    index: number,
    messages: any[]
  ) => {
    if (index === 0) return true;
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
        )}
      </button>
      <BasePopup id={id} open={open} anchor={anchor}>
        <PopupBody>
          {!activeChatId && (
            <div className="overflow-y-auto max-h-full">
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.chatId || `${chat.clientId}-${chat.freelancerId}`} // 고유한 chatRoomId를 key로 사용
                  name={chat.name}
                  messagePreview={chat.messagePreview}
                  timestamp={chat.timestamp}
                  chatId={chat.chatId}
                  unreadCount={chat.unreadCount}
                  onClick={() => {
                    setActiveChatId(chat.chatId);
                    setActiveFreelancerId(Number(chat.freelancerId)); // 클릭 시 프리랜서 ID 설정
                    connectWebSocket(Number(chat.chatId));
                  }}
                />
              ))}
            </div>
          )}

          {activeChatId && (
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="text-mainGreen underline"
                >
                  <FaArrowLeft />
                </button>
                <h2 className="text-lg font-bold ml-2">
                  채팅방 {activeChatId}
                </h2>
              </div>

              <div className="flex-grow overflow-y-auto p-4 max-h-96">
                {messages.map((message, index) => (
                  <div key={index}>
                    {shouldDisplayDate(message.timestamp, index, messages) && (
                      <MessageDateComponent date={message.timestamp} />
                    )}
                    {message.senderId === clientId ? (
                      <MyMessageComponent message={message.content} />
                    ) : (
                      <OtherMessageComponent message={message.content} />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <ChatInputComponent
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSend={sendMessage}
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
      ? "0px 4px 8px rgb(0 0 0 / 0.7)"
      : "0px 4px 8px rgb(0 0 0 / 0.1)"
  };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`
);
