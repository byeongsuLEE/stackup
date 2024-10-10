import { useEffect, useState } from "react";
import { accountInfo } from "../apis/Account.type";
import { accountUpdate, getAccount, getMainAccount } from "../apis/AccountsApi";
import AccountList from "../components/AccountPage/AccountList"; 

const Account = () => {
  const [ isAccount, setIsAccount ] = useState<boolean>(false);
  const [accountList, setAccountList] = useState<accountInfo[]>([]);
  const [ mainAccount, setMainAccount ] = useState<string>(""); 

  useEffect(() => {
    
    const update = async () => {
      
      await accountUpdate();

      const data = await getAccount();

      if (data.length === 0) {
        setIsAccount(false);
        
      } else {
        setIsAccount(true);
        setAccountList(data);

        const main = await getMainAccount();
        setMainAccount(main);
      }    
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
          <div className="">
          <AccountList accountList={ accountList } mainAccount={mainAccount} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className="my-10">등록된 계좌가 없습니다.</span>
        </div>
      )}

    </div>

  )
}

export default Account;