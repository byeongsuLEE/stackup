import AccountBox from "../components/AccountDetailPage/AccountBox";
import TransactionList from "../components/AccountDetailPage/TransactionList";

const AccountDetail = () => {
  return (
    <div className="flex flex-col mt-20">
      <div className="flex flex-col items-center">

        <AccountBox />
      </div>
      <span className="mt-10 ml-28 text-lg">거래 내역</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-20 my-5"></div>
      <TransactionList />
    </div>
  )
}
export default AccountDetail;
