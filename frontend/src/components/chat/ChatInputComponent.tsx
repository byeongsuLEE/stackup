import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInputComponent = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); // 메시지 전송 후 입력 필드 초기화
    }
  };

  return (
    <div className="flex items-center mt-4">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
        className="flex-1 border border-gray-300 rounded-lg p-2 mr-2"
      />
      <button
        onClick={handleSendMessage}
        className="bg-mainGreen text-white py-2 px-4 rounded-lg hover:bg-subGreen1"
      >
        전송
      </button>
    </div>
  );
};

export default ChatInputComponent;
