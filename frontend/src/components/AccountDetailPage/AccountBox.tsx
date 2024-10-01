import { useState } from "react";
import { accountDetailInfo } from "../../apis/Account.type";
import DoneButton from "../common/DoneButton";
import CheckPassword from "./CheckPassword";
import SetPassword from "./SetPassword";
import { mainAccout } from "../../apis/AccountsApi";

const AccountBox = ({ bank, accountNo, balance }: accountDetailInfo) => {
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const handleSetPassword = () => {
    // SetPassword 버튼을 눌렀을 때 상태를 변경하여 CheckPassword가 렌더링되도록 함
    setIsPasswordSet(true);
  };

  const handleMainAccount = () => {
    mainAccout();
  }
  
  return (
    <div className="bg-bgGreen flex flex-col justify-between p-10 border border-mainGreen rounded-lg w-[1000px] h-[200px]">
      <div className="flex items-center justify-between">
        <div>
          <span className="mr-5">{bank}</span>
          <span>{accountNo}</span>
        </div>
        <div onClick={handleMainAccount}>
          <DoneButton width={150} height={20} title="대표 계좌로 설정" />
        </div>
      </div>
      <div className="flex justify-center font-bold text-xl">
        {balance} 원
      </div>
      <div className="flex items-center justify-end">
      {isPasswordSet ? (
          <CheckPassword />
        ) : (
          <SetPassword onSetPassword={handleSetPassword} />
        )}
        <div className="ml-2">
        <DoneButton width={100} height={30} title="송금하기" />
        </div>
      </div>
    </div>
  )
}
export default AccountBox;