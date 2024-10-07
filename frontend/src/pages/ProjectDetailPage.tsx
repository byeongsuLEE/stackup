import axios from "axios";
import InfoBox from "../components/WorkPage/InfoBox";
import DoneButton from "../components/common/DoneButton";
import CandidateIcon from "../icons/CandidateIcon";
import PeriodIcon from "../icons/PeriodIcon";
import PriceIcon from "../icons/PriceIcon";
import { useNavigate } from "react-router-dom";

const svURL = import.meta.env.VITE_SERVER_URL;

const ProjectDetail = () => {
  const navigate = useNavigate(); // navigate 훅 초기화
  const userId = 15; // 임시 userId
  const projectId = 31; // 임시 projectId 

  const handleNavigateToMitermForm = () => {
    console.log("이동")
    navigate(`/evaluate/final/${projectId}`, { state: { userId } }); // MitermForm으로 이동
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

  return (
    <div className="m-20 flex items-center flex-col">
      <div className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 p-5 h-[120px] flex flex-col">
        <ul className="steps">
          <li className="step step-success">기획 및 설계</li>
          <li className="step step-success">퍼블리셔 및 디자인</li>
          <li className="step">개발</li>
          <li className="step">테스트</li>
          <li className="step">배포</li>
        </ul>
      </div>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px] ">
        <div className="flex justify-between ">
          <span className="text-lg font-bold">프로젝트명</span>
          <div onClick={handleReport}>
            <button className="w-[80px] h-[25px] rounded-md bg-red-400 text-white flex items-center justify-center font-bold text-sm">신고하기</button>
          </div>
        </div>
        <span className="text-subTxt text-sm">대분류</span>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div className="flex justify-center mb-10">
          <InfoBox title="금액" content="1000000원" info={PriceIcon} />
          <InfoBox title="기간" content="30일" info={PeriodIcon} />
          <InfoBox title="팀원" content="3명" info={CandidateIcon} />
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
              <span>2024년 9월 1일 ~ 2024년 9월 31일</span>
              <span className="text-xs ml-2 text-red-400">마감 3일전</span>
            </div>
            <span>재택</span>
            <span>C++, Java</span>
            <span>Spring, React</span>
            <span>연락이 빠른 프리랜서를 원합니다.</span>
          </div>
        </div>
        <div className="text-end" onClick={handleNavigateToMitermForm}>
          <DoneButton width={100} height={30} title="단계 완료" />
        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div>
          <div className="font-bold text-lg mb-2">업무 내용</div>
          <br />
          <span>
            프로젝트 개요 : <br />
            - 운용 중인 서비스에 “취약점 점검 스캐너”기능 추가 <br />
            - 취약점 점검 스크립트 목록을 DB로 관리/운용하는 (입력/프로젝트 단위의 실행 관리/결제/스케줄링) Rest API 개발<br />
            - 인증/인가와 같은 API 공통 기능은 기존 MSA 프로젝트에서 사용하는 라이브러리를 재활용 <br />
            현재 준비 상황 : <br />
            - 상세 기획서 초안 완료 상태- 레퍼런스로 활용할 수 있는 유사한 기능의 소스코드를 참조용으로 제공 <br />
            필요 요소 : <br />
            - API 설계=내부 인원과 협의- MSA API 서비스 개발- 개발 문서 작성= ERD, API 상세 명세서<br />
            - 정기적인 코드 리뷰 → 코딩 컨벤션 등 개발 세부사항을 개발 책임자와 협의 <br />
            개발환경/언어/방식 : <br />
            - JDK 1.X- Spring Boot 2.X.X<br />
            - Spring Cloud<br />
            - Eureka, Zuul, Spring Cloud Config<br />
            - MyBatis/ MySQL<br />
            - F/E= React 16.X.X<br />
            - CI/CD= GitLab + Jenkins주요 개발 ⇒ 오프라인 미팅 시 상세 \내용 및 기획서 설명<br />
            - CMS 게시판 (어드민 포함)<br />
            - 내부 서비스 연동<br />
            -- 회원, 멤버, 권한<br />
            -- 에이전트<br />
            -- 알림<br />
            -- 기타<br />
            - 게시판 연관 기능 <br />
            산출물 :<br />
            - ERD<br />
            - API 상세 명세서<br />
            - 소스코드<br />
            코드 리뷰용 문서요구사항 :<br />
            - 주 5일 상근 (9:00 - 5:00) → 기획자 및 내부 개발자와 소통<br />
            - 주 1회 코드 리뷰 → 개발 세부사항 협의 <br />
          </span>
        </div>

      </div>
    </div>
  )
}
export default ProjectDetail;