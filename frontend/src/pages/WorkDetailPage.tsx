import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectDetail } from "../apis/BoardApi";
import Detail from "../components/WorkDetailPage/Detail";
import DetailSide from "../components/WorkDetailPage/DetailSide";
import { project, projectBasic } from "../apis/Board.type";

const WorkDetail = () => {
  const { boardId } = useParams();
  const [ project, setProject ] = useState<project>(projectBasic);

  useEffect(() => {
    const detail = async () => {
      const data = await projectDetail(boardId);
      setProject(data)
    }
    detail();
  }, [])

  return (
    <div className="flex justify-center">
      <Detail {...project}/>
      {/* 프리랜서 */}
      <DetailSide {...project}/>
    </div>
  )
}

export default WorkDetail;
