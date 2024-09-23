import { useState } from "react";
import { Link } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import useSendSSFTokens from "../../hooks/useToken";

interface SignListBoxProps {
  title: string;
  period: string;
  company: string;
}

const SignListBox = ({ title, period, company }: SignListBoxProps) => {
  const { sendSSFToken } = useSendSSFTokens();
  const [recipient, setRecipient] = useState(''); // 받는 사람 주소
  const [amount, setAmount] = useState(0); // 전송할 토큰 수량

  const handleSend = () => {
    sendSSFToken(recipient, amount);
  };

  return (
    <div className="bg-bgGreen border border-mainGreen h-[100px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span>{title} _ {company}</span>
        <span>{period}</span>
      </div>
      <Link to="/signature/detail">
      <DoneButton width={100} height={30} title="서명하기" />
      </Link>

      <div>
      <input
        type="text"
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount to send"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={handleSend}>Send SSF Tokens</button>
    </div>
    </div>
  )
}
export default SignListBox;