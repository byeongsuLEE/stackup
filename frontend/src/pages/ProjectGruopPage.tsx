import { useEffect, useState } from "react";
import Group from "../components/ProjectGroupPage/Group";
import { useParams } from "react-router-dom";
import { candidate } from "../apis/Freelancer.type";
import { selectedCandidate } from "../apis/ClientApi";

const ProjectGroup = () => {
  const { boardId } = useParams<string>();
  const [ candidateList, setCandidateList ] = useState<candidate[]>([]);

  useEffect(() => {
    const update = async () => {
      const data = await selectedCandidate(boardId);
      setCandidateList(data);
    }

    update();
  }, [])

  return (
    <>
    <span className="font-bold text-subGreen1 mx-10 text-lg">계약 관리</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
        <div className="mx-40">
      <table className="table">
        <thead>
          <tr>
            <th className="p-0 pl-10 py-3">이름</th>
          </tr>
        </thead>
        <tbody>
          {candidateList?.map((candidate: candidate) => (
            <Group {...candidate} key={candidate.email}/>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}
export default ProjectGroup;