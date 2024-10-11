import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { project, projectBasic } from "../apis/Board.type";
import { projectDetail } from "../apis/BoardApi";
import Detail from "../components/WorkDetailPage/Detail";

const WorkDetail = () => {
  const { boardId } = useParams();
  const [project, setProject] = useState<project>(projectBasic);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      const data = await projectDetail(boardId);
      setProject(data); 
      if (data && data.client) {
        setClientId(data.client.id); 
      }
    };

    fetchProjectDetail();
  }, [boardId]);

  return (
    <div className="flex justify-center">
      <Detail project={project} clientId={clientId} />
    </div>
  );
};

export default WorkDetail;
