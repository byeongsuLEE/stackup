import axios from "axios";
import DoneButton from "../common/DoneButton";
import Radios from "../common/Radios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { projectDetail } from "../../apis/BoardApi";

const svURL = import.meta.env.VITE_SERVER_URL;

const MitermForm = () => {
  // 상태 변수 설정
  const location = useLocation()
  const { userId, boardId, stepResponse, freelancerProjectId } = location.state;
  const { projectId } = useParams<{ projectId: string }>();
  const [responseTimeScore, setResponseTimeScore] = useState<number | null>(null);
  const [reqChangeFreqScore, setReqChangeFreqScore] = useState<number | null>(null);
  const [reqClarityScore, setReqClarityScore] = useState<number | null>(null);
  const navigate = useNavigate();
  const [ clientId, setClientId ] = useState<string>();
  const [ id, setId ] = useState<string>();

  useEffect(() => {
    const update = async () => {
      const data = await projectDetail(boardId);
      setClientId(data.client.id);
    };
  
    update();
  }, [boardId]);

  useEffect(() => {
    console.log(svURL); // svURL 값이 localhost로 출력되는지 확인
  }, []);
  
  
  useEffect(() => {
    if (clientId) {
      if (sessionStorage.getItem('userType') === 'freelancer') {
        setId(clientId);
      } else {
        setId(userId);
      }
    }
  }, [clientId, userId]);

  const handleSubmit = async () => {
    if (!id) {
      console.error("ID 값이 설정되지 않았습니다.");
      alert("ID 값이 설정되지 않았습니다. 다시 시도해 주세요.");
      return;
    }

    // 평가 점수 객체 생성
    const evaluationData = {
      userId: id,
      projectId: Number(projectId),
      responseTimeScore: responseTimeScore,
      reqChangeFreqScore: reqChangeFreqScore,
      reqClarityScore: reqClarityScore,
      type : "MIDDLE"
    };

    try {
      await axios(`${svURL}/user/evaluation/project-user`, {
        method: "POST",
        headers: {
          ContentType : "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        data: evaluationData,
      });
      // 추가적인 작업 (예: 성공 메시지 표시, 폼 초기화 등)
      // 폼 초기화
      setResponseTimeScore(null);
      setReqChangeFreqScore(null);
      setReqClarityScore(null);

      // 성공 메시지 표시
      alert("평가가 성공적으로 완료되었습니다.");
      if (sessionStorage.getItem('userType') === 'client'){
        navigate(`/transfer/${projectId}`, {state:{userId, boardId, stepResponse, freelancerProjectId}});
      } else {
        navigate(`/project/detail/${projectId}`, {state:{userId, boardId, stepResponse}})
      }
      

    } catch (error) {
      console.error("Error submitting evaluation:", error);
      // 오류 처리 (예: 오류 메시지 표시)
    }
  };
  return (
    <div className="bg-bgGreen border flex flex-col border-mainGreen h-auto w-auto mt-10 p-10 rounded-lg">
      <div className="my-3">
        <Radios 
          title="1. 응답시간" 
          option1="빠름" 
          option2="중간" 
          option3="느림" 
          value={responseTimeScore} // 선택된 값
          onChange={setResponseTimeScore} // 선택한 값 업데이트
          value1={5} // option1의 값
          value2={3} // option2의 값
          value3={1.5} // option3의 값
        />
      </div>
      <div className="my-3">
        <Radios 
          title="2. 요구사항 변경 빈도" 
          option1="적음" 
          option2="중간" 
          option3="많음"  
          value={reqChangeFreqScore} // 선택된 값
          onChange={setReqChangeFreqScore} // 선택한 값 업데이트
          value1={5} // option1의 값
          value2={3} // option2의 값
          value3={1.5} // option3의 값
        />
      </div>
      <div className="my-3">
        <Radios 
          title="3. 요구사항 명확성" 
          option1="명확" 
          option2="중간" 
          option3="불명확" 
          value={reqClarityScore} // 선택된 값
          onChange={setReqClarityScore} // 선택한 값 업데이트
          value1={5} // option1의 값
          value2={3} // option2의 값
          value3={1.5} // option3의 값
        />
      </div>
      <div className="text-right mt-2"  onClick={handleSubmit}>
      <DoneButton width={100} height={30} title="평가 완료"/>
      </div>
    </div>
  )
}
export default MitermForm;