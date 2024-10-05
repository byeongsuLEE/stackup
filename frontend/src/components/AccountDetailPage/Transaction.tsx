import { transactionInfo } from "../../apis/Account.type";

const Transaction = ({transactionDate, transactionTime, transactionType, transactionBalance, transactionAfterBalance, transactionSummary}: transactionInfo) => {

  return (
    <tbody>
        <tr>
          <td className="text-center">{transactionDate} {transactionTime}</td>

          {transactionType === '1' ? (
            <>
              <td className="text-center">{transactionBalance} 원</td>
              <td></td>
            </>
          ) : (
            <>
              <td></td>
              <td className="text-center">{transactionBalance} 원</td>
            </>
          )
          }

          <td className="text-center">{transactionSummary}</td>
          <th className="text-center">{transactionAfterBalance} 원</th>
        </tr>
      
      </tbody>
  )
}
export default Transaction;