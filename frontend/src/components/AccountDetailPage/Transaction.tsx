interface TransactionProps {
  date: string;
  deposit?: number;
  withdraw?: number;
  balance: number;
  use: string;
}
const Transaction = ({date,deposit, withdraw, balance, use}:TransactionProps) => {
  return (
    <tbody>
        <tr>
          <th>{date}</th>
          <td>{deposit}</td>
          <td>{withdraw}</td>
          <td>{use}</td>
          <th>{balance}</th>
        </tr>
      
      </tbody>
  )
}
export default Transaction;