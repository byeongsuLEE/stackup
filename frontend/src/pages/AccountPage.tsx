import { useEffect, useState } from "react";
import { accountInfo } from "../apis/Account.type";
// import { accountUpdate, getAccount, getMainAccount } from "../apis/AccountsApi";
import { accountUpdate, getAccount } from "../apis/AccountsApi";
import AccountList from "../components/AccountPage/AccountList";
import DoneButton from "../components/common/DoneButton";
import PlusIcon from "../icons/PlusIcon";

const Account = () => {
  const isAccount = true;

  const [accountList, setAccountList] = useState<accountInfo[]>([]);
  const [ mainAccount, setMainAccount ] = useState<string>(""); 
  console.log(setMainAccount)

  useEffect(() => {
    const update = async () => {
      await accountUpdate();

      const data = await getAccount();
      setAccountList(data);

      // const main = await getMainAccount();
      // setMainAccount(main);
    }
    
    update();
  }, [])

  return (
    <div className="m-20">
      <span className="text-lg font-bold ml-20 text-subGreen1">
        계좌 조회
      </span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-10 my-5"></div>
      {isAccount ? (
        <div>
          <div className="flex items-center justify-end mr-20 mb-5">
            <span className="mr-2">
              계좌 추가
            </span>
            <PlusIcon />
          </div>
          <div className="">
          <AccountList accountList={ accountList } mainAccount={mainAccount} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="my-10">등록된 계좌가 없습니다.</span>
          <DoneButton width={150} height={40} title="계좌 등록" />
        </div>
      )}

    </div>

  )
}

export default Account;