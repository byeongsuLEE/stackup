import React from "react";

interface ChatListItemProps {
    name: string;
    chatId: string;
    // timestamp: string;
    //   messagePreview: string;
    //   unreadCount: number;
    onClick?: (chatId: string) => void; // 클릭 핸들러 추가 (선택적 속성)
}

const ChatListItem: React.FC<ChatListItemProps> = ({
    chatId,
    name,
    // timestamp,
    //   messagePreview,
    //   unreadCount,
    onClick, // onClick 속성 추가
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(chatId); // 클릭 시 chatId를 넘김
        }
    };
    return (
        <div onClick={handleClick} style={styles.container}>
            <div style={styles.content}>
                {/* 대화 상대 이름 */}
                <div style={styles.name}>{name}</div>
                {/* 미리보기 메시지 */}
                {/* <div style={styles.messagePreview}>{messagePreview}</div> */}
            </div>

        </div>
    );
};

// 스타일 정의
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        borderBottom: "1px solid #e0e0e0",
        cursor: "pointer",
    },
    content: {
        display: "flex",
        flexDirection: "column",
    },
    name: {
        fontWeight: "bold",
        fontSize: "16px",
    },
    messagePreview: {
        fontSize: "14px",
        color: "#888888",
    },
    rightSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    timestamp: {
        fontSize: "12px",
        color: "#aaaaaa",
    },
    unreadBadge: {
        marginTop: "5px",
        backgroundColor: "#ff3b30", // 빨간색 배지
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: "12px",
        padding: "2px 6px",
        borderRadius: "12px",
        textAlign: "center",
        minWidth: "20px",
    },
};

export default ChatListItem;
