import { accountDetailInfo } from "../../apis/Account.type";
import DoneButton from "../common/DoneButton";

const AccountBox = ({bank, accountNo, balance} : accountDetailInfo) => {
  return (
    <div className="bg-bgGreen flex flex-col justify-between p-10 border border-mainGreen rounded-lg w-[1000px] h-[200px]">
      <div className="flex items-center justify-between">
        <div>
        <span className="mr-5">{bank}</span>
        <span>{accountNo}</span>
        </div>
        <div>
          <DoneButton width={150} height={20} title="대표 계좌로 설정" />
        </div>
      </div>
      <div className="flex justify-center font-bold text-xl">
        {balance} 원
      </div>
      <div className="text-end">
        <DoneButton width={100} height={30} title="송금하기" />
      </div>
    </div>
  )
}
export default AccountBox;