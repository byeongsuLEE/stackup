import React, { useState } from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void; // 메시지를 보낼 때 호출될 함수
}

const ChatInputComponent: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
}) => {
  const handleSendMessage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      onSend(); // 메시지를 전송
    }
  };

  return (
    <div className="chat-input flex items-center mt-4">
      <input
        type="text"
        placeholder="메시지를 입력하세요..."
        value={value} // 입력 값을 props로 전달
        onChange={onChange} // 입력 변경 시 호출되는 함수
        onKeyDown={handleSendMessage} // Enter 키 입력 시 메시지 전송
        className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
      />
      <button
        onClick={onSend}
        className="bg-mainGreen text-white py-2 px-4 rounded-lg hover:bg-subGreen1"
      >
        전송
      </button>
    </div>
  );
};

export default ChatInputComponent;
