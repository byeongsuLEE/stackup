import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import { styled } from "@mui/system";
import { useState } from "react";
import ChatIcon from "../../icons/ChatIcon";
import ChatListItem from "../chat/ChatListItem";
import { useChatStore } from "../../store/ChatStore";
import { FaArrowLeft } from "react-icons/fa";
import { useUserStore } from "../../store/UserStore"; // 로그인한 유저 정보 불러오기
import ChatRoom from "../chat/ChatRoom";
import axios from "axios";

const svURL = import.meta.env.VITE_SERVER_URL;

export interface client {
    client: {
        id: number;
        name: string | null; // name이 null일 수 있으므로 이를 반영
    },
    title: string;
    boardId: number;
}

export default function SimplePopup() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const [activeChatId, setActiveChatId] = useState<string | null>(null); // 활성화된 채팅방 ID 상태
    // const [newMessages, setNewMessages] = useState<boolean>(true); // 새 메시지 여부
    const [clientList, setClientList] = useState<client[] | []>([]);
    console.log(clientList)

    const loadChats = useChatStore((state) => state.loadChats);
    const chats = useChatStore((state) => state.chats);

    const userType = sessionStorage.getItem('userType')

    const { clientId, freelancerId } = useUserStore((state) => ({
        clientId: state.clientId,
        freelancerId: state.freelancerId,
    })); // 로그인한 유저 정보 가져오기

    const fetchClient = async () => {
        try {
            let url = '';
            if (userType === 'freelancer') {
                url = `${svURL}/board/apply-client`; // 프리랜서에 대한 API 엔드포인트
            } else if (userType === 'client') {
                url = `${svURL}/board/myboard`; // 클라이언트에 대한 API 엔드포인트
            }
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            });
            console.log(response.data)
            setClientList(response.data); // chatId와 clientId를 동일하게 설정
            loadChats(response.data)
        } catch (error) {
            console.error("채팅방 목록을 가져오는 중 오류 발생:", error);
        }
    };

    // useEffect(() => {
    //     setNewMessages(true); // 새로운 메시지 감지 (여기서는 테스트용으로 true로 설정, 실제로는 메시지 수신 로직 추가)
    // }, [loadChats]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        fetchClient()
        setAnchor(anchor ? null : event.currentTarget);
        // setNewMessages(false); // 메시지 창이 열리면 새 메시지 배지를 숨김
    };

    const open = Boolean(anchor);
    const id = open ? "simple-popup" : undefined;

    const handleChatClick = (chatId: string) => {
        console.log(chatId)
        setActiveChatId(chatId); // 채팅방을 클릭했을 때 해당 채팅방의 내용을 활성화
        console.log(`ClientId: ${clientId}, FreelancerId: ${freelancerId}`);
    };

    const activeChat = chats.find((chat) => chat.chatId === activeChatId);

    return (
        <div style={{ position: "relative" }}>
            <button
                aria-describedby={id}
                type="button"
                onClick={handleClick}
                style={{ position: "relative" }}
            >
                <ChatIcon />
                {/* {newMessages && (
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
                )}{" "} */}
                {/* 새 메시지 배지 */}
            </button>
            <BasePopup id={id} open={open} anchor={anchor}>
                <PopupBody>
                    {/* 활성화된 채팅방이 없다면 채팅 리스트를 표시 */}
                    {!activeChatId && (
                        <div className="overflow-y-auto max-h-full">
                            {/* 스크롤 추가 */}
                            {chats.length === 0 ? (
                                <div className="text-center mt-5">
                                    {userType === 'freelancer' ? '지원한 프로젝트가 없습니다' : '게시한 프로젝트가 없습니다'}
                                </div>
                            ) : (
                                chats.map((chat) => (
                                    <ChatListItem
                                        key={chat.chatId}
                                        name={chat.name}
                                        chatId={chat.chatId}
                                        // timestamp={chat.registTime}
                                        onClick={() => handleChatClick(chat.chatId)} // 클릭 시 채팅방 활성화
                                    />
                                ))
                            )}
                        </div>
                    )}

                    {/* 활성화된 채팅방이 있다면 해당 채팅방의 내용을 표시 */}
                    {activeChatId && activeChat && (
                        <div className="flex flex-col h-full">
                            {/* 제목과 뒤로가기 버튼을 한 줄로 표시 */}
                            <div className="flex items-center mb-5">
                                <button
                                    onClick={() => setActiveChatId(null)}
                                    className="text-mainGreen underline"
                                >
                                    <FaArrowLeft />
                                </button>
                                <h2 className="text-lg font-bold ml-2">{activeChat.name}</h2>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4">
                                <ChatRoom chatRoomId={activeChatId} />

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
  margin-bottom: 5px;
  border-radius: 20px;
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  box-shadow: ${theme.palette.mode === "dark"
            ? `0px 4px 8px rgb(0 0 0 / 0.7)`
            : `0px 4px 8px rgb(0 0 0 / 0.1)`
        };
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  z-index: 1;
`
);
