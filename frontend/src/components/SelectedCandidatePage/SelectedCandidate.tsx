import { useNavigate, useParams } from "react-router-dom";
import { candidate } from "../../apis/Freelancer.type";
import DoneButton from "../common/DoneButton";

const SelectedCandidate = ({ name,  portfolioUrl, totalScore, freelancerProjectId }: candidate) => {
  const navigate = useNavigate();
  const { boardId } = useParams();

  const handleContract = () => {
    console.log(freelancerProjectId)
    navigate(`/work/detail/contract/${boardId}/${freelancerProjectId}`)
  }

  return (
    <tr>
      <td className="text-center">{name}</td>
      <td className="text-center">{totalScore}</td>
      <td className="text-center">
        <a href={portfolioUrl}>{portfolioUrl}</a>
      </td >
      <td className="flex justify-center mt-1.5 center">
        <div className="mr-3" onChange={handleContract}>
          <DoneButton width={100} height={30} title="서명하기" />
        </div>
      </td>
    </tr>
  );
};
export default SelectedCandidate;
