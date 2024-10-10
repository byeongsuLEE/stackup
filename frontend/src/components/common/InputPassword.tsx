// SecureKeypad.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { confirmPassword, transfer } from "../../apis/AccountsApi";


interface InputPasswordProps {
  userId: number,
  projectId?: string,
  stepResponse: string,
  boardId?: string,
  middleAmount?: number,
  finalAmount?: number,
}

// 숫자 버튼의 랜덤 배열을 생성하는 함수
const generateRandomButtonValues = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString()); // 0부터 9까지
  const shuffled = numbers.sort(() => Math.random() - 0.5);
  return shuffled;
};

// 삭제 및 완료 버튼의 배치 상태를 유지하기 위해 사용
const generateFixedButtons = () => ["삭제", "완료"];

const InputPassword = ({ userId, projectId, stepResponse, boardId, middleAmount, finalAmount }: InputPasswordProps) => {
  const [isKeypadVisible, setIsKeypadVisible] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [buttonValues, setButtonValues] = useState<string[]>([]);
  const [fixedButtons] = useState<string[]>(generateFixedButtons());
  const maxLength = 4;
  const navigate = useNavigate();

  const handleTransfer = async () => {

    if (stepResponse === 'DEVELOPMENT' && middleAmount) {
      console.log('middleAmount:', middleAmount);
      console.log(userId, middleAmount.toString());
      await transfer(userId, middleAmount.toString());

    } else if (stepResponse === 'DEPLOYMENT' && finalAmount) {
      await transfer(userId, finalAmount.toString());
    }

    navigate(`/evaluate/check/${projectId}`, { state: { userId, stepResponse, boardId } });
  }

  // 키패드가 보일 때마다 버튼 숫자 랜덤화
  useEffect(() => {
    if (isKeypadVisible) {
      setButtonValues(generateRandomButtonValues());
    }
  }, [isKeypadVisible]);

  const handleButtonClick = async (value: string) => {
    if (value === "삭제") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (value === "완료") {
      try {
        const response = await confirmPassword(inputValue); // 비동기 응답 대기
        if (response) { // 응답이 성공적일 때
          setIsKeypadVisible(false);
          await handleTransfer(); // 비밀번호가 확인된 후 handleTransfer 호출
        } else {
          alert("비밀번호가 올바르지 않습니다.");
        }
      } catch (error:any) {
        console.error("비밀번호 확인 중 오류 발생:", error.message);
        alert("비밀번호 확인에 실패했습니다. 다시 시도해 주세요.");
      }
    } else {
      if (inputValue.length < maxLength) {
        setInputValue((prev) => prev + value);
      } else {
        alert(`최대 ${maxLength}자까지 입력할 수 있습니다.`);
      }
    }
  };

  return (
    <div>
      {isKeypadVisible && (
        <div
          className="fixed top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full bg-black/50"
          onClick={() => setIsKeypadVisible(false)}
        >
          <input
            type="password"
            value={inputValue}
            readOnly
            className="text-sm border p-2 mb-2 rounded-lg"
            placeholder="비밀번호를 입력하세요"
          />
          <div
            className="bg-white w-[300px] h-[400px] rounded flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 grid-rows-4 gap-1 p-1 flex-grow">
              {buttonValues.map((value, index) => (
                <button
                  key={index}
                  className="flex items-center justify-center bg-mainGreen text-white"
                  onClick={() => handleButtonClick(value)}
                >
                  {value}
                </button>
              ))}
              {fixedButtons.map((value, index) => (
                <button
                  key={index + 10}
                  className="flex items-center justify-center bg-subTxt text-white"
                  onClick={() => handleButtonClick(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPassword;
