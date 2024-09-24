import { differenceInDays, format } from "date-fns";
import { Link } from "react-router-dom";
import { project } from "../../apis/Project.type";
import WebIcon from "../../icons/WebIcon";
import InfoBox from "../WorkPage/InfoBox";
import DoneButton from "../common/DoneButton";

const Detail = (project: project) => {

  const remainDay = differenceInDays(project.deadline, format(Date(), 'yyyy-MM-dd'));
  const workType = project.worktype? "재택" : "기간제 상주";
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

  return (
    <>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px]] my-20 mx-10">
        <div className="flex flex-col">
          <span className="text-lg font-bold">{project?.title}</span>
          <span className="text-subTxt text-sm">{classification}</span>
        </div>
        <div className="flex justify-end">

          {window.sessionStorage.getItem("userType") === 'freelancer'? (
            <DoneButton width={100} height={25} title="지원하기" />
          ) : (
            <div>
              <Link to="/work/detail/candidate">
              <DoneButton width={100} height={25} title="지원자 관리" />
              </Link>

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
            {/* <span>{project.language}</span> */}
            <span>java, c++</span>
            {/* <span>{project.framework}</span> */}
            <span>spring, vue</span>
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

