import { useEffect, useState } from "react";
import { candidate } from "../../apis/Freelancer.type";
import { selectedCandidate } from "../../apis/ClientApi";
import { useParams } from "react-router-dom";
import SelectedCandidate from "./SelectedCandidate";

const SelectedCandidateList = () => {

  const { boardId } = useParams();
  const [ selectList, setSelectList ] = useState<candidate[]>([]);

  useEffect(() => {
    const update = async () => {
      const data = await selectedCandidate(boardId);
      setSelectList(data)
    }

    update();
  }, [])

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th className="text-center">이름</th>
            <th className="text-center">평점</th>
            <th className="text-center">포트폴리오</th>
            <th className="text-center">서명</th>
          </tr>
        </thead>
        <tbody>
          {selectList?.map((candidate) => (
            <SelectedCandidate {...candidate} key={candidate.id}/>
          ))}
        </tbody>
      </table>


    </div>
  );
};
export default SelectedCandidateList;
