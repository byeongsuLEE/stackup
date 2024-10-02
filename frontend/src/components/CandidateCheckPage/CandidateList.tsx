import { useNavigate, useParams } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import Candidate from "./Candidate";

const CandidateList = () => {
  const boardId = useParams<{ boardId: string }>().boardId;
  const navigate = useNavigate();
  const toProjectGroup = () => {
    navigate(`/work/projectgroup/${boardId}`);
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>채용 여부</th>
            <th>이름</th>
            <th>평점</th>
            <th>포트폴리오</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <Candidate
            name="이호영"
            portfolio="github.com/hoyoung"
            rating={5.0}
            freelancerId="freelancer123"
          />
        </tbody>
      </table>
      <div className="text-end mt-5" onClick={toProjectGroup}>
        <DoneButton width={150} height={30} title="시작하기" />
      </div>

    </div>
  );
};
export default CandidateList;
