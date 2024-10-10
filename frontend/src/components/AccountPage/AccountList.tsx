import { Link } from "react-router-dom";
import Account from "./Account";
import { accountInfo } from "../../apis/Account.type";
import MainAccount from "./MainAccount";
import { useEffect, useState } from "react";

const AccountList = ({ accountList, mainAccount }: { accountList: accountInfo[]; mainAccount: string }) => {
  const [ main, setMain ] = useState<accountInfo>();
  const [ list, setList] = useState<accountInfo[]>();

  useEffect(() => {
    const mainData = accountList.find(item =>  item.accountNum == mainAccount);
    setMain(mainData);

  }, [accountList, mainAccount]);

  useEffect(() => {
    if (main) {
      const data = accountList.filter(item => item.accountNum != mainAccount);
      setList(data);
    }
  }, [main, accountList, mainAccount]);
  
  return (
    <div className="flex flex-wrap justify-center">

      {main ? (
        <Link to={`/account/detail/${main.accountId}`} key={main.accountId} className="w-full p-2">
          <MainAccount {...main} />
        </Link>
      ) : (
        <>
        </>
      )}

    {list?.map((account: accountInfo) => (
      <Link to={`/account/detail/${account.accountId}`} key={account.accountId} className="w-full sm:w-1/2 md:w-1/3 p-2">
        <div className="flex justify-center">
          <Account {...account} />
        </div>
      </Link>
    ))}
    </div>
  );
}

export default AccountList;
