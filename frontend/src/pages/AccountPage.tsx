import { Link } from "react-router-dom";
import AccountList from "../components/AccountPage/AccountList";
import MainAccount from "../components/AccountPage/MainAccount";
import DoneButton from "../components/common/DoneButton";
import PlusIcon from "../icons/PlusIcon";

const Account = () => {
  const isAccount = true;
  const isMainAccount = true;

  return (
    <div className="m-20">
      <span className="text-lg font-bold ml-20 text-subGreen1">
        계좌 조회
      </span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-10 my-10"></div>
      {isAccount ? (
        <div>
          <div className="flex items-center justify-end mr-20 mb-5">
            <span className="mr-2">
              계좌 추가
            </span>
            <PlusIcon />
          </div>
          <div className="flex flex-col items-center">
            <Link to="/account/detail">
            {isMainAccount &&
            <MainAccount />
            }
            </Link>
            <AccountList />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="my-10">등록된 계좌가 없습니다.</span>
          <DoneButton width={150} height={40} title="계좌 등록"/>
        </div>
      )}

    </div>

  )
}

export default Account;