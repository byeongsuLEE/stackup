import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectApplicantProps } from "../../apis/Board.type";
import { projectApplicant } from "../../apis/BoardApi";
import DoneButton from "../common/DoneButton";
import Candidate from "./Candidate";
import { projectProps } from "../../apis/Project.type";

const CandidateList = () => {
  const [List, setList] = useState<projectProps[]>([]);
  const boardId = useParams<{ boardId: string }>().boardId;
  const navigate = useNavigate();
  const toProjectGroup = () => {
    navigate(`/work/projectgroup/${boardId}`);
  };

  const [candidateList, setCandidateList] = useState<projectApplicantProps[]>(
    []
  );
  const update = async () => {
    const data = await projectApplicant(boardId as string);
    setCandidateList(data);
  };
  // 첫 렌더링 시에만 API 호출
  useEffect(() => {
    update();
  }, []); // 빈 배열이므로, 컴포넌트가 처음 렌더링될 때만 실행

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
          {candidateList?.map(
            (candidate: projectApplicantProps, index: number) => (
              <Candidate {...candidate} key={index} />
            )
          )}
        </tbody>
      </table>
      <div className="text-end mt-5" onClick={toProjectGroup}>
        <DoneButton width={150} height={30} title="시작하기" />
      </div>
    </div>
  );
};
export default CandidateList;
