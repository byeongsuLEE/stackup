import { accountInfo } from "../../apis/Account.type";

const MainAccount = (account: accountInfo) => {
  return (
    <div className="bg-bgGreen p-10 border border-mainGreen rounded-lg h-[200px]">
      <div className="flex items-center">
        <img className="mr-2 w-[40px] h-[40px]" src={`/bankicons/${account.bankCode}.png`} alt="" />
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