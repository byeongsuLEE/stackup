import { Link } from "react-router-dom";
import Account from "./Account";
import { accountInfo } from "../../apis/Account.type";
import MainAccount from "./MainAccount";

const AccountList = ({ accountList, mainAccount }: { accountList: accountInfo[]; mainAccount: string }) => {

  return (
    <div className="flex flex-wrap justify-center">
      {accountList.map((account: accountInfo) => (
        account.accountNum === mainAccount ? (
          // MainAccount는 전체 너비 차지하고 가운데 정렬
          <Link to={`/account/detail/${account.accountId}`} key={account.accountId} className="w-full p-2">
              <MainAccount {...account} />
          </Link>
        ) : (
          // Account는 한 줄에 3개씩 배치되고 가운데 정렬
          <Link to={`/account/detail/${account.accountId}`} key={account.accountId} className="w-full sm:w-1/2 md:w-1/3 p-2">
            <div className="flex justify-center">
              <Account {...account} />
            </div>
          </Link>
        )
      ))}
    </div>
  );
}

export default AccountList;
