import { useNavigate } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import Candidate from "./Candidate";

const CandidateList = () => {
  const navigate = useNavigate();
  const toContract = () => {
    navigate("/work/detail/contract");
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
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
          <Candidate name="이호영" portfolio="github.com/hoyoung" rating={5.0} />
        </tbody>
      </table>
      <div className="my-5 text-end" onClick={toContract}>
      <DoneButton width={80} height={30} title="계약하기"/>
      </div>
    </div>
  )
}
export default CandidateList;