import { accountInfo } from "../../apis/Account.type";

const MainAccount = (account: accountInfo) => {
  return (
    <div className="bg-bgGreen p-10 border border-mainGreen rounded-lg w-[1000px] h-[200px]">
      <div>
        <span className="mr-5">{account.accountName}</span>
        <span>{account.accountNum}</span>
      </div>
      <div className="flex justify-center font-bold text-xl my-10">
        {account.balnace} 원
      </div>
    </div>
  )
}
export default MainAccount;