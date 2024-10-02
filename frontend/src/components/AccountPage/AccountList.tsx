import { Link } from "react-router-dom";
import Account from "./Account";
import { accountInfo } from "../../apis/Account.type";

interface accountListProp {
  accountList: accountInfo[];
}

const AccountList = ({accountList}: accountListProp) => {

  return (
    <div className="flex flex-wrap">
      <div className="flex justify-center">
        {accountList.map((account: accountInfo) => (
          <Link to="/account/detail" key={account.accountId}>
          <Account {...account}/>
          </Link>
        ))}
        
      </div>

    </div>
  )
}
export default AccountList;