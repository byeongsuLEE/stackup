import { differenceInDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { project } from "../../apis/Board.type";
import { projectApply } from "../../apis/FreelancerApi";
import WebIcon from "../../icons/WebIcon";
import InfoBox from "../WorkPage/InfoBox";
import DoneButton from "../common/DoneButton";

const Detail = (project: project) => {
  const boardId = project.boardId;
  const navigate = useNavigate();
  const toCandidate = () => {
    navigate(`/work/detail/candidate/${boardId}`);
  }

  const remainDay = differenceInDays(project.deadline, format(Date(), 'yyyy-MM-dd'));
  const workType = project.worktype ? "재택" : "기간제 상주";
  let classification = null

  if (project.classification === 'web') {
    classification = '웹'
  } else if (project.classification === 'mobile') {
    classification = '모바일'
  } else if (project.classification === 'publisher') {
    classification = '퍼블리셔'
  } else if (project.classification === 'ai') {
    classification = 'AI'
  } else if (project.classification === 'db') {
    classification = 'DB'
  }

    // frameworks와 languages 배열을 join으로 , 구분하여 출력
    const frameworksList = project.frameworks.map(framework => framework.name);
    const languagesList = project.languages.map(language => language.name);

    // frameworks와 languages 배열을 for문을 사용하여 , 구분된 하나의 string으로 만들기
  // let frameworksString = '';
  // for (let i = 0; i < project.frameworks.length; i++) {
  //   frameworksString += project.frameworks[i].name;
  //   if (i < project.frameworks.length - 1) {
  //     frameworksString += ', '; // 마지막 요소가 아닐 경우에만 구분자 추가
  //   }
  // }

  // let languagesString = '';
  // for (let i = 0; i < project.languages.length; i++) {
  //   languagesString += project.languages[i].name;
  //   if (i < project.languages.length - 1) {
  //     languagesString += ', '; // 마지막 요소가 아닐 경우에만 구분자 추가
  //   }
  // }

  const projectApplyHandler = async () => {
    try {
      await projectApply(boardId);
      alert("지원이 완료되었습니다.");
    } catch (error: any) {
      if (error.response) {
        // 서버에서 받은 응답이 있는 경우
        console.error("Error response:", error.response.data);
        alert(`지원 실패: ${error.response.status} - ${error.response.data.message}`);
      } else if (error.request) {
        // 요청이 서버에 도달하지 못한 경우
        console.error("Error request:", error.request);
        alert("지원 실패: 서버와의 통신에 문제가 발생했습니다.");
      } else {
        // 기타 에러
        console.error("Error:", error.message);
        alert("지원 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  }

  return (
    <>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px]] my-20 mx-10">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{project?.title} _ {classification}</span>
          <span className="text-subTxt text-sm">{project?.client.businessName} _ 평점 {project?.client.totalScore}wja</span>
        </div>
        <div className="flex justify-end">

          {window.sessionStorage.getItem("userType") === 'freelancer' ? (
            <div
              onClick={projectApplyHandler}>
              <DoneButton width={100} height={25} title="지원하기" />
            </div>
          ) : (
            <div className="flex">
              <div onClick={toCandidate}>
                <DoneButton width={100} height={25} title="지원자 관리" />
              </div>
              <button className="bg-subGreen2 text-bgGreen font-bold text-sm px-3 rounded-lg ml-2">마감하기</button>
            </div>
          )}
        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div className="flex justify-center mb-10">
          <InfoBox title="예상 금액" category="deposit" content={project.deposit} info={WebIcon} />
          <InfoBox title="예상 기간" category="period" content={project.period} info={WebIcon} />
          <InfoBox title="지원자 수" category="applicants" content={project.applicants} info={WebIcon} />
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

            {/* 수정필요 => 데이터 안옴*/}
            <span>{frameworksList.join(', ')}</span>
            <span>{languagesList.join(', ')}</span>
            {/* <span>{frameworksString}</span>
            <span>{languagesString}</span> */}
            {/* 수정 필요 */}
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
  )
}

export default Detail;

