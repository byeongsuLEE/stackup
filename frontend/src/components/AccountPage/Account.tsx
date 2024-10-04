import { accountInfo } from "../../apis/Account.type";

const Account = (account: accountInfo) => {
  return (
    <div className="bg-bgGreen border flex flex-col justify-between border-mainGreen w-[300px] h-[200px] my-5 rounded-lg p-5">
      <div className="flex items-center">
        <img className="mr-2 w-[40px] h-[40px]" src={`./bankicons/${account.bankCode}.png`} alt="" />
      <div className="flex flex-col">
        <span className="font-bold">{account.accountName}</span>
        <span className="text-sm">{account.accountNum}</span>
      </div>
      </div>
      <div className="text-right">
        {account.balnace} 원
      </div>
    </div>
  )
}
export default Account;
