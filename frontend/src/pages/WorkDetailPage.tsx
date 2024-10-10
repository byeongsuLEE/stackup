import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { project, projectBasic } from "../apis/Board.type";
import { projectDetail } from "../apis/BoardApi";
import Detail from "../components/WorkDetailPage/Detail";

const WorkDetail = () => {
  const { boardId } = useParams();  // URL 파라미터에서 boardId 가져오기
  const [project, setProject] = useState<project>(projectBasic);  // 프로젝트 기본 상태 설정
  const [clientId, setClientId] = useState<string | null>(null);  // clientId 상태 관리

  useEffect(() => {
    // 비동기로 프로젝트 상세 정보 가져오기
    const fetchProjectDetail = async () => {
      try {
        const data = await projectDetail(boardId);  // API 호출로 프로젝트 정보 가져오기
        setProject(data);  // 프로젝트 상태 업데이트
        if (data && data.client) {
          setClientId(data.client.id);  // clientId 상태 업데이트
        }
      } catch (error) {
        console.error("Failed to fetch project details", error);  // 오류 로그 출력
      }
    };

    fetchProjectDetail();  // 함수 실행
  }, [boardId]);  // boardId가 변경될 때마다 실행

  return (
    <div className="flex justify-center">
      {/* project와 clientId를 props로 전달 */}
      <Detail project={project} clientId={clientId} />
    </div>
  );
};

export default WorkDetail;
