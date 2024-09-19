import { transactionInfo } from "../../apis/Account.type";

const Transaction = ({transactionDate, transactionTime, transactionType, transactionBalance, transcationAfterBalance, transcationSummary}: transactionInfo) => {
  return (
    <tbody>
        <tr>
          <th>{transactionDate}</th>
          {/* 수정 필요 */}
          <td>{transactionType}</td>
          <td>{transactionBalance}</td>
          {/* 수정 필요*/}
          <td>{transcationSummary}</td>
          <th>{transcationAfterBalance}</th>
        </tr>
      
      </tbody>
  )
}
export default Transaction;