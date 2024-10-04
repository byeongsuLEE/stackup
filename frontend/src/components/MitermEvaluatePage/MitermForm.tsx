import DoneButton from "../common/DoneButton";
import Radios from "../common/Radios";
import { useState } from "react";

interface MitermFormProps {
  projectId: number; // 프로젝트 ID
  userId: number; // 사용자 ID
}

const MitermForm :React.FC<MitermFormProps> = ({projectId, userId}) => {
  // 상태 변수 설정
  const [responseTimeScore, setResponseTimeScore] = useState(null);
  const [reqChangeFreqScore, setReqChangeFreqScore] = useState(null);
  const [reqClarityScore, setReqClarityScore] = useState(null);

  const handleSubmit = async () => {
    // 평가 점수 객체 생성
    const evaluationData = {
      userId: userId,
      projectId: projectId,
      responseTimeScore: responseTimeScore,
      reqChangeFreqScore: reqChangeFreqScore,
      reqClarityScore: reqClarityScore,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/project/middle-evaluation/${projectId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // JWT 토큰 추가
        },
        body: JSON.stringify(evaluationData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Evaluation submitted successfully:", result);
      // 추가적인 작업 (예: 성공 메시지 표시, 폼 초기화 등)

    } catch (error) {
      console.error("Error submitting evaluation:", error);
      // 오류 처리 (예: 오류 메시지 표시)
    }
  };
  return (
    <div className="bg-bgGreen border flex flex-col border-mainGreen h-auto w-auto mt-10 p-10 rounded-lg">
      <div className="my-3">
      <Radios title="1. 응답시간" option1="빠름" option2="중간" option3="느림" onChange={setResponseTimeScore}/>
      </div>
      <div className="my-3">
      <Radios title="2. 요구사항 변경 빈도" option1="적음" option2="중간" option3="많음"  onChange={setReqChangeFreqScore}/>
      </div>
      <div className="my-3">
      <Radios title="3. 요구사항 명확성" option1="명확" option2="중간" option3="불명확" onChange={setReqClarityScore}/>
      </div>
      <div className="text-right mt-2">
      <DoneButton width={100} height={30} title="평가 완료" onClick={handleSubmit}/>
      </div>
    </div>
  )
}
export default MitermForm;