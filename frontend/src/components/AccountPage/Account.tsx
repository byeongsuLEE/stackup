const Account = () => {
  return (
    <div className="bg-bgGreen border flex flex-col justify-between border-mainGreen w-[300px] h-[200px] m-5 rounded-lg p-5">
      <div className="flex items-center">
        <img className="mr-2 w-[40px] h-[40px]" src="./bankicons/금융아이콘_PNG_SK.png" alt="" />
      <div className="flex flex-col">
        <span className="font-bold">은행명</span>
        <span className="text-sm">계좌 번호</span>
      </div>
      </div>
      <div className="text-right">
        잔액
      </div>
    </div>
  )
}
export default Account;
