import { useEffect, useState } from "react";
import AccountBox from "../components/AccountDetailPage/AccountBox";
import TransactionList from "../components/AccountDetailPage/TransactionList";
import { accountDetail, accountTransaction } from "../apis/AccountsApi";
import { useParams } from "react-router-dom";
import { accountDetailInfo, transactionInfo } from "../apis/Account.type";

const AccountDetail = () => {
  const { accountId } = useParams();

  //== account detail ==//
  const [ account, setAccount ] = useState<accountDetailInfo>();
  const [ transactionList, setTransactionList ] = useState<transactionInfo[]>([]);

  useEffect(() => {
    const update = async () => {
      const accountData = await accountDetail(accountId);
      setAccount(accountData)

      const transactionData = await accountTransaction(accountId);
      setTransactionList(transactionData)
    }
    update();
  }, [])


  return (
    <div className="flex flex-col mt-20">
      <div className="flex flex-col items-center">
        <AccountBox {...account}/>
      </div>
      
      <span className="mt-10 ml-28 text-lg">거래 내역</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-20 my-5"></div>
      <TransactionList transactionList={transactionList}/>
    </div>
  )
}
export default AccountDetail;
