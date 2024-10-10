import { useState } from "react";
import { accountInfo } from "../../apis/Account.type";
import DoneButton from "../common/DoneButton";
import CheckPassword from "./CheckPassword";
import SetPassword from "./SetPassword";
import { mainAccout } from "../../apis/AccountsApi";

interface AccountBoxProps {
  account: accountInfo;
  mainAccount: string;
}

const AccountBox = ({ account, mainAccount }: AccountBoxProps) => {
  const [isPasswordSet, setIsPasswordSet] = useState(false);

  const handleSetPassword = async() => {
    // SetPassword 버튼을 눌렀을 때 상태를 변경하여 CheckPassword가 렌더링되도록 함
    setIsPasswordSet(true);
  };

  const handleMainAccount = async() => {
    await mainAccout(account.accountId);
    window.location.reload();
  }
  
  if (!account) {
    return <div>No account information available</div>;
  }
  
  return (
    <div className="bg-bgGreen flex flex-col justify-between p-10 border border-mainGreen rounded-lg w-[1000px] h-[200px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
        <img className="mr-2 w-[40px] h-[40px]" src={`/bankicons/${account.bankCode}.png`} alt="" />
          <span className="mr-5">{account.accountName}</span>
          <span>{account.accountNum}</span>
        </div>
        
        {account.accountNum == mainAccount ? (
          <div className= "flex items-center justify-center h-[30px] w-[90px] bg-subGreen2 rounded-lg text-white">대표계좌</div>
        ) : (
          <div onClick={handleMainAccount}>
            <DoneButton width={150} height={20} title="대표 계좌로 설정" />
          </div>
        )}
      </div>
      <div className="flex justify-center font-bold text-xl">
        {account.balnace} 원
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