import { Link } from "react-router-dom";
import Account from "./Account";

const AccountList = () => {

  return (
    <div className="flex flex-wrap">
      <div className="flex justify-center">
        <Link to="/account/detail">
        <Account />
        </Link>
      </div>

    </div>
  )
}
export default AccountList;