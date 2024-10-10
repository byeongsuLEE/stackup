import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectApplicantProps } from "../../apis/Board.type";
import { projectApplicant } from "../../apis/BoardApi";
import DoneButton from "../common/DoneButton";
import Candidate from "./Candidate";
import { startProject } from "../../apis/ProjectApi";

const CandidateList = () => {
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [candidateList, setCandidateList] = useState<projectApplicantProps[]>([]);

  const toProjectGroup = async() => {
    
    const project = await startProject(checkedList, String(boardId));
    
    navigate(`/work/detail/select/${boardId}/${project.projectId}`);
  }

  const update = async () => {
    const data = await projectApplicant(boardId);
    setCandidateList(data)
  }

  const handleCheck = (id: number) => {
    setCheckedList((list) => {
      if(list.includes(id)) {
        return list.filter(candidateId => candidateId !== id)
      } else {
        return [...list, id]
      }
    })
  }

  useEffect(() => {
    update();
  }, []);

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
          {candidateList?.map((candidate: projectApplicantProps, index: number) => (
            <Candidate {...candidate} onCheckboxChange={handleCheck} key={index} />
          ))}
        </tbody>
      </table>
      <div className="text-end mt-5" onClick={toProjectGroup}>
        <DoneButton width={150} height={30} title="시작하기" />
      </div>

    </div>
  );
};
export default CandidateList;
