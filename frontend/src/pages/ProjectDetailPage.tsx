import axios from "axios";
import { addDays, differenceInDays, format, isValid } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { project, projectBasic } from "../apis/Board.type";
import { contractProjectDetail, projectStep } from "../apis/ProjectApi";
import InfoBox from "../components/WorkPage/InfoBox";
import AlertBox from "../components/common/AlertBox";
import DoneButton from "../components/common/DoneButton";
import CandidateIcon from "../icons/CandidateIcon";
import PeriodIcon from "../icons/PeriodIcon";
import PriceIcon from "../icons/PriceIcon";

interface Step {
  name: string;
  completed: boolean;
}

const svURL = import.meta.env.VITE_SERVER_URL;

const ProjectDetail = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true); // 추가: 로딩 상태 관리

  const handleConfirmStep = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      window.location.reload();
    }, 1000);
  };

  const [buttonTitle, setButtonTitle] = useState("단계 완료");
  const [steps, setSteps] = useState<Step[]>([
    { name: "기획 및 설계", completed: false },
    { name: "퍼블리셔 및 디자인", completed: false },
    { name: "개발", completed: false },
    { name: "테스트", completed: false },
    { name: "배포", completed: false },
  ]);

  type Status =
    | "DEPLOYMENT"
    | "DESIGN"
    | "DEVELOPMENT"
    | "PLANNING"
    | "TESTING";

  const responseMapping: Record<Status, string> = {
    DEPLOYMENT: "배포",
    DESIGN: "퍼블리셔 및 디자인",
    DEVELOPMENT: "개발",
    PLANNING: "기획 및 설계",
    TESTING: "테스트",
  };

  const updateSteps = (status: Status) => {
    const stepName = responseMapping[status];
    const stepIndex = steps.findIndex((step) => step.name === stepName);

    if (stepIndex !== -1) {
      const updatedSteps = steps.map((step, index) => ({
        ...step,
        completed: index <= stepIndex,
      }));
      setSteps(updatedSteps);
    }
  };

  const navigate = useNavigate();
  const userId = 10;
  const { projectId } = useParams<{ projectId: string }>();
  const numericProjectId = projectId ? parseInt(projectId, 10) : undefined;

  const [project, setProject] = useState<project>(projectBasic);
  const [workType, setWorkType] = useState("");
  const [stepResponse, setStepResponse] = useState<Status | null>(null);

  useEffect(() => {
    if (numericProjectId !== undefined) {
      const fetchProjectDetail = async () => {
        try {
          const data = await contractProjectDetail(numericProjectId);
          setProject(data);
          setStepResponse(data.step)
          setWorkType(data.worktype ? "재택" : "통근");
          setLoading(false); // 추가: 데이터 로딩 완료 후 로딩 상태 해제
        } catch (error) {
          console.error("Failed to fetch project details", error);
          setLoading(false); // 실패 시에도 로딩 상태 해제
        }
      };
      fetchProjectDetail();
    } else {
      console.error("numericProjectId가 정의되지 않았습니다.");
    }
  }, [numericProjectId]);

  const frameworksList = project?.frameworks
    ? project.frameworks.map((framework) => framework.name)
    : [];
  const languagesList = project?.languages
    ? project.languages.map((language) => language.name)
    : [];

  useEffect(() => {
    if (stepResponse) {
      updateSteps(stepResponse);
      setButtonTitle(`${responseMapping[stepResponse]} 완료`);
    }
  }, [stepResponse]);

  const startDateObject = new Date(project.startDate);
  if (!isValid(startDateObject)) {
    return
  }

  const startDate = format(startDateObject, "yyyy-MM-dd");
  const periodAsNumber = parseInt(project.period.replace(/[^0-9]/g, ""), 10);
  const endDateObject = addDays(startDateObject, periodAsNumber);

  if (!isValid(endDateObject)) {
    return
  }
  
  const endDate = format(endDateObject, "yyyy-MM-dd");
  const remainDay = differenceInDays(new Date(endDate), new Date());
  const period = `${startDate} ~ ${endDate}`;
  const boardId = project.boardId;

  const handleNavigateToEvaluate = () => {
    if (sessionStorage.getItem('userType') === 'client'){
      navigate(`/evaluate/check/${projectId}`, { state: { stepResponse, boardId } });

    } else if (stepResponse === 'DEVELOPMENT') {
      navigate(`/evaluate/miterm/${projectId}`, { state: { stepResponse, boardId }});

    } else {
      navigate(`/evaluate/final/${projectId}`, { state: { stepResponse, boardId }});
    }
  };

  const handleStep = async () => {
    try {
      if (stepResponse) {
        await projectStep(numericProjectId, stepResponse, true);
        handleConfirmStep();

        if (stepResponse === "DEVELOPMENT") {
          handleNavigateToEvaluate();
        } else if (stepResponse === "DEPLOYMENT") {
          handleNavigateToEvaluate();
        }

      } else {
        console.warn("stepResponse 값이 없습니다.");
      }

    } catch (error) {
      console.error("프로젝트 단계 변경 중 오류가 발생했습니다:", error);
    }
  };

  const handleReport = async () => {
    try {
      const response = await axios.patch(`${svURL}/user/report/${userId}`);
      if (response.status === 200) {
        alert("신고가 완료되었습니다.");
      }
      
    } catch (error) {
      console.error("신고 실패:", error);
      alert("신고에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시할 내용
  }

  return (
    <div className="mx-20 my-10 flex items-center flex-col">
      {showAlert && <AlertBox title="단계 완료가 요청되었습니다." />}
      <div className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 p-5 h-[200px] flex flex-col">
        <ul className="steps">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`step ${step.completed ? "step-success" : ""}`}
            >
              {step.name}
            </li>
          ))}
        </ul>
        {sessionStorage.getItem("userType") === "client" ? (
          <>
            {project.freelancerStepConfirmed && stepResponse != "DEVELOPMENT"  ? (
              <div className="text-end mt-10" onClick={handleStep}>
                <DoneButton width={200} height={30} title={buttonTitle} />
              </div>
            ) : (
              <div>
                {project.freelancerStepConfirmed && stepResponse == "DEVELOPMENT" && (
                  <div className="text-end mt-10" onClick={handleNavigateToEvaluate}>
                    <DoneButton width={200} height={30} title="중간 평가 관리" />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {project.freelancerStepConfirmed ? (
              <div></div>
            ) : (
              <div className="text-end mt-10" onClick={handleStep}>
                <DoneButton width={200} height={30} title={buttonTitle} />
              </div>
            )}
          </>
        )}
      </div>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px] ">
        <div className="flex justify-between ">
          <span className="text-lg font-bold">{project.title}</span>
          <div onClick={handleReport}>
            <button className="w-[80px] h-[25px] rounded-md bg-red-400 text-white flex items-center justify-center font-bold text-sm">
              신고하기
            </button>
          </div>
        </div>
        <span className="text-subTxt">{project.classification}</span>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div className="flex justify-center mb-10">
          <InfoBox title="금액" content={project.deposit} info={PriceIcon} />
          <InfoBox title="기간" content={project.period} info={PeriodIcon} />
          <InfoBox title="팀원" content={project.applicants} info={CandidateIcon} />
        </div>

        <div className="flex ml-10">
          <div className="flex flex-col mr-20 text-subTxt">
            <span>프로젝트 기간</span>
            <span>근무 형태</span>
            <span>사용언어</span>
            <span>프레임워크</span>
            <span>기타 요구사항</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span>{period}</span>
              <span className="text-xs ml-2 text-red-400">마감 {remainDay}일 전</span>
            </div>
            <span>{workType}</span>
            {languagesList.length === 0 ? (
              <span>사용언어 미정</span>
            ) : (
              <span>{languagesList.join(", ")}</span>
            )}
            {frameworksList.length === 0 ? (
              <span>프레임워크 미정</span>
            ) : (
              <span>{frameworksList.join(", ")}</span>
            )}
            <span>{project.requirements}</span>
          </div>
        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div>
          <div className="font-bold text-lg mb-2">업무 내용</div>
          <br />
          <span>{project.description}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
