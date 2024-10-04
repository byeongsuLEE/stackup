// SecureKeypad.tsx

"use client";

import { useEffect, useState } from "react";
import DoneButton from "../common/DoneButton";
import { passwordStore } from "../../store/AccountStore";

// 숫자 버튼의 랜덤 배열을 생성하는 함수
const generateRandomButtonValues = () => {
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString()); // 0부터 9까지
  const shuffled = numbers.sort(() => Math.random() - 0.5);
  return shuffled;
};

// 삭제 및 완료 버튼의 배치 상태를 유지하기 위해 사용
const generateFixedButtons = () => ["삭제", "다음"];

const SetPassword = ({ onSetPassword }: { onSetPassword: () => void }) => {
  const [isKeypadVisible, setIsKeypadVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [buttonValues, setButtonValues] = useState<string[]>([]);
  const [fixedButtons] = useState<string[]>(generateFixedButtons());
  const maxLength = 4;

  const { checkoutPassword, setPassword } = passwordStore.getState();

  // 키패드가 보일 때마다 버튼 숫자 랜덤화
  useEffect(() => {
    if (isKeypadVisible) {
      setButtonValues(generateRandomButtonValues());
    }
  }, [isKeypadVisible]);

  const handleButtonClick = (value: string) => {
    if (value === "삭제") {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (value === "다음") {
      setIsKeypadVisible(false);

      setPassword(inputValue);

      setInputValue("");
      onSetPassword();
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
      <div onClick={() => setIsKeypadVisible(true)} >
        {checkoutPassword ? (
          <DoneButton width={120} height={30} title="비밀번호 수정" />
        ) : (
          <DoneButton width={120} height={30} title="비밀번호 설정" />
        )}
        
      </div>
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
            placeholder="비밀번호 설정"
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
                  onClick={() => handleButtonClick(value)
                  }
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

export default SetPassword;
