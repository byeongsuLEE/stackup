import { useNavigate } from "react-router-dom";
import { projectApplicantProps } from "../../apis/Board.type";
import DoneButton from "../common/DoneButton";

interface FreelancerProps {
  stepResponse: string;
  freelancer: projectApplicantProps;
  boardId: number;

}

const Freelancer = ({ stepResponse, freelancer, boardId }: FreelancerProps) => {
  const projectId = 106;
  const userId = freelancer.id;
  const navigate = useNavigate();
  const toEvaluate = () => {
    if (stepResponse == "DEVELOPMENT") {
      navigate(`/evaluate/miterm/${projectId}`, { state: { userId, stepResponse, boardId } });
    }
    else {
      navigate(`/evaluate/final/${projectId}`, { state: { userId } });
    }
  }
  console.log(freelancer.middleClientEvaluated)
  console.log(freelancer.finalClientEvaluated)
  return (
    <tr>
      <td>{freelancer.name}</td>
      <td className="flex justify-center mt-1.5">
        {stepResponse == "DEVELOPMENT" && freelancer.middleClientEvaluated ? (
          <div className="mr-3">
            <button disabled className="w-[100px] h-[30px] bg-subGreen1 text-white rounded-lg font-bold">평가완료</button>
          </div>
        ) : (
          <div className="mr-3" onClick={toEvaluate}>
            <DoneButton width={100} height={30} title="평가하기" />
          </div>
        )}
          {stepResponse == "DEPLOYMENT" && freelancer.finalClientEvaluated ? (
          <div className="mr-3">
            <button disabled className="w-[100px] h-[30px] bg-subGreen1 text-white rounded-lg font-bold">평가완료</button>
          </div>
        ) : (
          <div className="mr-3" onClick={toEvaluate}>
            <DoneButton width={100} height={30} title="평가하기" />
          </div>
        )}
      </td>
    </tr>
  )
}

export default Freelancer;