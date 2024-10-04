import { transactionInfo } from "../../apis/Account.type";
import Transaction from "./Transaction";

interface transactionListProp {
  transactionList: transactionInfo[];
}
const TransactionList = ({transactionList}: transactionListProp) => {
  
  return (
    <div className="mx-20">
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th className="text-center">일시</th>
          <th className="text-center">입금액</th>
          <th className="text-center">출금액</th>
          <th className="text-center">사용처</th>
          <th className="text-center">잔액</th>
        </tr>
      </thead>

      {transactionList.map((transaction: transactionInfo) => (
        <Transaction {...transaction} key={transaction.transactionUniqueNo}/>
      ))}
    </table>
  </div>
  )
}

export default TransactionList;