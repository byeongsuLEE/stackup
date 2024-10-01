import { Link } from "react-router-dom";
import DoneButton from "../common/DoneButton";

interface SignListBoxProps {
  title: string;
  period: string;
  company: string;
}

const SignListBox = ({ title, period, company }: SignListBoxProps) => {

  return (
    <div className="bg-bgGreen border border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{title} _ {company}</span>
        <span>{period}</span>
      </div>
      <Link to="/signature/detail">
        <DoneButton width={120} height={30} title="서명하기" />
      </Link>
    </div>
  )
}
export default SignListBox;