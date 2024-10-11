import { useNavigate, useParams } from "react-router-dom";
import { candidate } from "../../apis/Freelancer.type";
import DoneButton from "../common/DoneButton";

const SelectedCandidate = ({ name,  portfolioUrl, totalScore, freelancerProjectId, clientSigned }: candidate) => {
  const navigate = useNavigate();
  const { boardId, projectId } = useParams();

  const handleContract = () => {
    navigate(`/work/detail/contract/${boardId}/${projectId}/${freelancerProjectId}`)
  }

  const score =  Number(totalScore.toFixed(1));

  return (
    <tr>
      <td className="text-center">{name}</td>
      <td className="text-center">{score}</td>
      <td className="text-center">
        <a href={portfolioUrl}>{portfolioUrl}</a>
      </td >
      <td className="flex justify-center mt-1.5 center">
        {clientSigned ? (
          <div>
            <button disabled className="bg-subGreen1 text-white rounded-lg px-2 font-bold text-sm w-[100px] h-[30px]" > 서명완료</button>
          </div>
        ) : (
          <div className="mr-3" onClick={handleContract}>
            <DoneButton width={100} height={30} title="서명하기" />
          </div>
        )}
        
      </td>
    </tr>
  );
};
export default SelectedCandidate;
