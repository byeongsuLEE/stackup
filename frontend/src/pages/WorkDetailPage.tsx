import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { project, projectBasic } from "../apis/Board.type";
import { projectDetail } from "../apis/BoardApi";
import Detail from "../components/WorkDetailPage/Detail";

const WorkDetail = () => {
  const { boardId } = useParams();
  const [project, setProject] = useState<project>(projectBasic);

  useEffect(() => {
    const detail = async () => {
      const data = await projectDetail(boardId);
      setProject(data)
    }
    detail();
  }, [])

  return (
    <div className="flex justify-center">
      <Detail {...project} />
    </div>
  )
}

export default WorkDetail;
