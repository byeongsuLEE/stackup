import { Link } from "react-router-dom";
import WebIcon from "../../icons/WebIcon";
import InfoBox from "../WorkPage/InfoBox";
import DoneButton from "../common/DoneButton";


const Detail = () => {
  return (
    <>
      <div className="bg-bgGreen border border-mainGreen h-auto rounded-lg p-10 w-[1000px]] my-20 mx-10">
        <div className="flex flex-col">
          <span className="text-lg font-bold">프로젝트명</span>
          <span className="text-subTxt text-sm">대분류</span>
        </div>
        <div className="flex justify-end">
          {/* 프리랜서 */}
          <DoneButton width={100} height={25} title="지원하기" />
          {/* 클라이언트 */}
          <Link to="/work/detail/candidate">
            <DoneButton width={100} height={25} title="지원자 관리" />
          </Link>
          <button className="bg-subGreen2 text-bgGreen font-bold text-sm px-3 rounded-lg ml-2">마감하기</button>
        </div>

        <div className="bg-subTxt w-auto h-[1px] flex justify-center my-10"></div>

        <div className="flex justify-center mb-10">
          <InfoBox title="예상 금액" content="1000000원" info={WebIcon} />
          <InfoBox title="예상 기간" content="30일" info={WebIcon} />
          <InfoBox title="지원자 수" content="3명" info={WebIcon} />
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
              <span>2024년 9월 9일</span>
              <span className="text-xs ml-2 text-red-400">마감 3일전</span>
            </div>
            <span>3명</span>
            <span>2024년 9월 24일</span>
            <span>재택</span>

            <span>java, c++</span>
            <span>react, spring</span>
            <span>연락이 빠른 프리랜서를 원합니다.</span>
          </div>
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
    </>
  )
}

export default Detail;

