import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import Radios from "../common/Radios";
import { projectDetail } from "../../apis/BoardApi";

const svURL = import.meta.env.VITE_SERVER_URL;

const FinalForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, boardId, stepResponse, freelancerProjectId } = location.state;
  const { projectId } = useParams();
  const [ clientId, setClientId ] = useState<string>();
  const [ id, setId ] = useState<string>();

  // 상태값 선언 (각 점수와 한줄평을 관리)
  const [responseTimeScore, setResponseTimeScore] = useState<number | null>(null);
  const [reqChangeFreqScore, setReqChangeFreqScore] = useState<number | null>(null);
  const [reqClarityScore, setReqClarityScore] = useState<number | null>(null);
  const [progressScore, setProgressScore] = useState<number | null>(null);
  const [careerBenefitScore, setCareerBenefitScore] = useState<number | null>(null);
  const [authorityFreedomScore, setAuthorityFreedomScore] = useState<number | null>(null);
  const [legalTermsScore, setLegalTermsScore] = useState<number | null>(null);
  const [shortReview, setShortReview] = useState<string>("");

  useEffect(() => {
    const update = async () => {
      const data = await projectDetail(boardId);
      setClientId(data.client.id);
    };
  
    update();
  }, [boardId]);
  
  useEffect(() => {
    if (clientId) {
      if (sessionStorage.getItem('userType') === 'freelancer') {
        setId(clientId);
      } else {
        setId(userId);
      }
    }
  }, [clientId, userId]);

  // 서버로 데이터를 POST하는 함수
  const handleSubmit = async () => {
    if (!id) {
      console.error("ID 값이 설정되지 않았습니다.");
      alert("ID 값이 설정되지 않았습니다. 다시 시도해 주세요.");
      return;
    }

    const evaluationData = {
      userId: id,
      projectId: Number(projectId),
      responseTimeScore,
      reqChangeFreqScore,
      reqClarityScore,
      progressScore,
      careerBenefitScore,
      authorityFreedomScore,
      legalTermsScore,
      shortReview,
      type: "FINAL",
    };

    try {
      const response = await axios.post(`${svURL}/user/evaluation/project-user`, evaluationData, {
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      
      alert("평가가 성공적으로 완료되었습니다.");
      if (sessionStorage.getItem('userType') === 'client') {
        navigate(`/transfer/${projectId}`, {state:{userId, boardId, stepResponse, freelancerProjectId}});
      } else {
        navigate(`/project/detail/${projectId}`, {state:{userId, boardId, stepResponse, freelancerProjectId}});
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
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
          value={responseTimeScore}
          onChange={setResponseTimeScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3">
        <Radios
          title="2. 요구사항 변경 빈도"
          option1="적음"
          option2="중간"
          option3="많음"
          value={reqChangeFreqScore}
          onChange={setReqChangeFreqScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3">
        <Radios
          title="3. 요구사항 명확성"
          option1="명확"
          option2="중간"
          option3="불명확"
          value={reqClarityScore}
          onChange={setReqClarityScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3">
        <Radios
          title="4. 계획에 따라 작업이 진행되었나요?"
          option1="잘 진행됨"
          option2="중간"
          option3="잘 안 됨"
          value={progressScore}
          onChange={setProgressScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3">
        <Radios
          title="5. 이번 프로젝트가 본인의 경력에 도움이 될 것이라고 생각하나요?"
          option1="도움 됨"
          option2="중간"
          option3="도움 안 됨"
          value={careerBenefitScore}
          onChange={setCareerBenefitScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3">
        <Radios
          title="6. 개발 과정에서 본인의 권한과 자유도가 얼마나 있었나요?"
          option1="충분함"
          option2="중간"
          option3="부족함"
          value={authorityFreedomScore}
          onChange={setAuthorityFreedomScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3">
        <Radios
          title="7. 계약서에 명시된 특약 사항 중 본인에게 불리한 조항이 있었나요?"
          option1="없었음"
          option2="중간"
          option3="있었음"
          value={legalTermsScore}
          onChange={setLegalTermsScore}
          value1={5}
          value2={3}
          value3={1.5}
        />
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="shortReview">8. 클라이언트 한 줄 평가</label>
        <textarea
          id="shortReview"
          className="border border-subTxt w-[300px] h-[40px] rounded-lg p-2 my-2"
          value={shortReview}
          onChange={(e) => setShortReview(e.target.value)}
          placeholder="한 줄 평가를 입력하세요"
        />
      </div>
      <div className="text-right mt-2" onClick={handleSubmit}>
          <DoneButton width={100} height={30} title="평가 완료" />
      </div>
    </div>
  )
}
export default FinalForm;