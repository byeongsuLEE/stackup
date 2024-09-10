import AccountList from "../components/AccountPage/AccountList";
import MainAccount from "../components/AccountPage/MainAccount";
import PlusIcon from "../icons/PlusIcon";

const Account = () => {
  return (
    <div className="m-20">
      <span className="text-lg font-bold ml-20 text-subGreen1">
        계좌 조회
      </span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-10 my-10"></div>
      <div className="flex items-center justify-end mr-20 mb-5">
        <span className="mr-2">
          계좌 추가
        </span>
        <PlusIcon />
      </div>
      <div className="flex flex-col items-center">
        <MainAccount />
      <AccountList />
      </div>
    </div>

  )
}

export default Account;