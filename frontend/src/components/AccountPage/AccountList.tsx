import { Link } from "react-router-dom";
import Account from "./Account";
import { accountInfo } from "../../apis/Account.type";
import MainAccount from "./MainAccount";

const AccountList = ({ accountList, mainAccount }: { accountList: accountInfo[]; mainAccount: string }) => {

  return (
    <div className="flex flex-wrap">
      <div className="flex justify-center">
        {accountList.map((account: accountInfo) => (
          <Link to={`/account/detail/${account.accountId}`} key={account.accountId}>
            {account.accountNum === mainAccount ? (
              <MainAccount {...account}/>
            ) : (
              <Account {...account}/>
            )}
          </Link>
        ))}
        
      </div>

    </div>
  )
}
export default AccountList;