import axios from "axios";
import { differenceInDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { project as ProjectType } from "../../apis/Board.type";
import { projectDelete } from "../../apis/BoardApi";
import { projectApply } from "../../apis/FreelancerApi";
import CandidateIcon from "../../icons/CandidateIcon";
import PeriodIcon from "../../icons/PeriodIcon";
import PriceIcon from "../../icons/PriceIcon";
import Payment from "../../pages/PullupPage";
import InfoBox from "../WorkPage/InfoBox";
import DoneButton from "../common/DoneButton";

const svURL = import.meta.env.VITE_SERVER_URL;

interface DetailProps {
  project: ProjectType;
  clientId: string | null;
}

const Detail = ({ project, clientId }: DetailProps) => {
  const [sessionClientId, setSessionClientId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnomaly, setIsAnomaly] = useState<boolean | undefined>(undefined); // is_anomaly 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  const boardId = project.boardId;
  const navigate = useNavigate();
  const totalScore = Math.round(Number(project.client.totalScore) * 10) / 10;

  // 프로젝트 삭제
  const deleteProject = async () => {
    projectDelete(boardId);
  };

  const toCandidate = () => {
    navigate(`/work/detail/candidate/${boardId}`);
  };

  const remainDay = differenceInDays(
    new Date(project.deadline),
    new Date(format(new Date(), "yyyy-MM-dd"))
  );

  const workType = project.worktype ? "재택" : "기간제 상주";
  let classification = null;

  if (project.classification === "web") {
    classification = "웹";
  } else if (project.classification === "mobile") {
    classification = "모바일";
  } else if (project.classification === "publisher") {
    classification = "퍼블리셔";
  } else if (project.classification === "ai") {
    classification = "AI";
  } else if (project.classification === "db") {
    classification = "DB";
  }

  // frameworks와 languages 배열을 join으로 , 구분하여 출력
  const frameworksList = project.frameworks.map((framework) => framework.name);
  const languagesList = project.languages.map((language) => language.name);

  const projectApplyHandler = async () => {
    try {
      await projectApply(boardId);
      alert("지원이 완료되었습니다.");
      location.reload();
    } catch (error) {
      console.error("Error applying project:", error);
    }
  };

  // 클라이언트 ID와 세션 ID 비교하는 비동기 처리
  useEffect(() => {
    const fetchSessionClientId = async () => {
      const storedClientId = window.sessionStorage.getItem("userId");
      setSessionClientId(storedClientId);
      setIsLoaded(true); // 데이터가 모두 로드되었음을 나타냄
    };

    fetchSessionClientId();
  }, []); // 빈 배열로 설정하면 컴포넌트가 마운트될 때 한 번만 실행

  // boardId를 이용해 anomaly 확인
  useEffect(() => {
    if (project.level !== null && project.boardId !== undefined && project.boardId !== null) {
      const checkAnomaly = async () => {
        console.log(project.boardId)
        try {
          const response = await axios.get(`${svURL}/board/detect/illegal/${project.boardId}`);
          // console.log('이상거래 response : ',response)
          // console.log('이상거래 response.data : ',response.data)
          const anomaly = response.data.is_anomaly[0] == "false" ? true : false;
          setIsAnomaly(anomaly);
        } catch (_error) {
          setIsAnomaly(undefined)
          // console.error("Error fetching anomaly data:", error);
        } finally {
          setLoading(false); // 로딩 완료
        }
      };
      checkAnomaly();
    }

  }, [project]);

  if (!isLoaded || loading) {
    // 데이터가 아직 로드되지 않았다면 로딩 화면 표시
    return <div>Loading...</div>;
  }

  const sessionFreelancerId = window.sessionStorage.getItem("freelancerId");
  const hasApplied = project.applicantList.some(
    (applicant) => applicant.id.toString() === sessionFreelancerId
  );

  return (
    <>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px]] my-20 mx-10">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{project?.title} _ {classification}</span>
          <span className="text-subTxt text-sm">{project?.client.businessName} _ 평점 {totalScore}점</span>
        </div>
        <div className="flex justify-end">
          {window.sessionStorage.getItem("userType") === "freelancer" ? (
            <>
              {!hasApplied ? (
                <div onClick={projectApplyHandler}>
                  <DoneButton width={100} height={25} title="지원하기" />
                </div>
              ) : (
                <div>
                  <button disabled className="bg-subGreen1 text-white rounded-lg px-2 font-bold text-sm w-[100px] h-[30px]" >지원완료</button>
                </div>
              )}
            </>
          ) : sessionClientId == clientId && (
            <div className="flex">
              {project.startProject ? (
                <>
                  <Payment boardId={boardId} />
                  <button onClick={deleteProject} className="bg-subGreen2 text-bgGreen font-bold text-sm px-3 rounded-lg ml-2">
                    삭제하기
                  </button>
                </>
              ) : (
                <>
                  <div onClick={toCandidate}>
                    <DoneButton width={100} height={25} title="지원자 관리" />
                  </div>
                  <Payment boardId={boardId} />
                  <button onClick={deleteProject} className="bg-subGreen2 text-bgGreen font-bold text-sm px-3 rounded-lg ml-2">
                    삭제하기
                  </button>
                </>
              )}

            </div>
          )}

        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div className="flex justify-center mb-10">
          <InfoBox title="예상 금액" category="deposit" content={project.deposit} info={PriceIcon} isAnomaly={isAnomaly} />
          <InfoBox title="예상 기간" category="period" content={project.period} info={PeriodIcon} />
          <InfoBox title="지원자 수" category="applicants" content={project.applicants} info={CandidateIcon} />
        </div>

        <div className="flex ml-10">
          <div className="flex flex-col mr-20 text-subTxt">
            <span>모집 마감일</span>
            <span>모집 인원</span>
            <span>프로젝트 시작일</span>
            <span>근무 형태</span>

            <span>사용언어</span>
            <span>프레임워크</span>
            <span>기타 요구사항</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span>{project.deadline.toString()}</span>
              <span className="text-xs ml-2 text-red-400">마감 {remainDay}일 전</span>
            </div>
            <span>{project.recruits} 명</span>
            <span>{project.startDate.toString()}</span>
            <span>{workType}</span>

            {languagesList.length === 0 ? (<span>사용언어 미정</span>) : (<span>{languagesList.join(', ')}</span>)}
            {frameworksList.length === 0 ? (<span>프레임워크 미정</span>) : (<span>{frameworksList.join(', ')}</span>)}
            <span>{project.requirements}</span>
          </div>
        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>
        <div>
          <div className="font-bold text-lg mb-2">업무 내용</div>
          <br />
          <span><pre>{project.description}</pre></span>
        </div>
      </div>
    </>
  );
};

export default Detail;
