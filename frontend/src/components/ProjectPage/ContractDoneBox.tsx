import { useEffect, useState } from "react";
import { project } from "../../apis/Board.type";
import { projectStep } from "../../apis/ProjectApi";
import { useNavigate } from "react-router-dom";

interface Step {
  name: string;
  completed: boolean;
}


const ContractDoneBox = ({ title, period, projectId }: project) => {
  const steps: Step[] = [
    { name: '기획 및 설계', completed: false },
    { name: '퍼블리셔 및 디자인', completed: false },
    { name: '개발', completed: false },
    { name: '테스트', completed: false },
    { name: '배포', completed: false },
  ];

  type Status = 'DEPLOYMENT' | 'DESIGN' | 'DEVELOPMENT' | 'PLANNING' | 'TESTING';
  const responseMapping: Record<Status, string> = {
    DEPLOYMENT: '배포',
    DESIGN: '퍼블리셔 및 디자인',
    DEVELOPMENT: '개발',
    PLANNING: '기획 및 설계',
    TESTING: '테스트',
  };

  function updateSteps(status: Status) {
    const stepName = responseMapping[status];
    const stepIndex = steps.findIndex((step) => step.name === stepName);

    if (stepIndex !== -1) {
      for (let i = 0; i <= stepIndex; i++) {
        steps[i].completed = true;
      }
    }
  }

  const [stepResponse, setStepResponse] = useState<string | null>(null);

  useEffect(() => {
    // 프로젝트 단계 확인
    const fetchStepResponse = async () => {
      try {
        const response = await projectStep(projectId); // 비동기 처리
        setStepResponse(response.data.currentStep);  // 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch project step", error);
      }
    };

    fetchStepResponse();  // 단계 값 불러오기
  }, []);  // project.worktype 대신 projectId로 종속성 설정
  updateSteps(stepResponse as Status);

  const navigate = useNavigate();
  const toDetail = () => {  
    navigate(`/project/detail/${projectId}`);
  } 

  return (
    <>
      <div
      onClick={toDetail} 
      className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 pt-10 px-5 h-[200px] flex flex-col">
        <ul className="steps">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`step ${step.completed ? 'step-success' : ''}`}>
              {/* {step.name} */}
            </li>))}
        </ul>
        <div className="flex flex-col ml-5 mt-6">
          <span className="text-lg">프로젝트명 : {title}</span>
          <span className="text-sm text-subTxt my-2">기간 : {period}</span>
        </div>
      </div>
    </>
  )
}
export default ContractDoneBox;