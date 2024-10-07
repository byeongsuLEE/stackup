import { Link } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import { project } from "../../apis/Board.type";

const SignListBox = (sign: project) => {
  const freelancerProjectId = sign.freelancerProjectId;
  
  return (
    <div className="bg-bgGreen border my-2 border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{sign.title} _ {sign.client.businessName}</span>
        <span>{sign.period}</span>
      </div>
      <Link to={`/signature/detail/${freelancerProjectId}`}>
        <DoneButton width={120} height={30} title="서명하기" />
      </Link>
    </div>
  )
}
export default SignListBox;