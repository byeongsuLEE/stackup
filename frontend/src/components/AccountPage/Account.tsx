import { accountInfo } from "../../apis/Account.type";

const Account = ({bank, accountNo, balance, bankCode}: accountInfo) => {
  return (
    <div className="bg-bgGreen border flex flex-col justify-between border-mainGreen w-[300px] h-[200px] m-5 rounded-lg p-5">
      <div className="flex items-center">
        <img className="mr-2 w-[40px] h-[40px]" src="./bankicons/금융아이콘_PNG_SK.png" alt="" />
      <div className="flex flex-col">
        <span className="font-bold">{bank}</span>
        <span className="text-sm">{accountNo}</span>
      </div>
      </div>
      <div className="text-right">
        {balance}
      </div>
    </div>
  )
}
export default Account;
