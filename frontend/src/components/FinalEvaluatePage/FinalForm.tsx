import { Link } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import Radios from "../common/Radios";

const FinalForm = () => {
  return (
    <div className="bg-bgGreen border flex flex-col border-mainGreen h-auto w-auto mt-10 p-10 rounded-lg">
      <div className="my-3">
        <Radios title="1. 응답시간" option1="빠름" option2="중간" option3="느림" />
      </div>
      <div className="my-3">
        <Radios title="2. 요구사항 변경 빈도" option1="적음" option2="중간" option3="많음" />
      </div>
      <div className="my-3">
        <Radios title="3. 요구사항 명확성" option1="명확" option2="중간" option3="불명확" />
      </div>
      <div className="my-3">
        <Radios title="4. 계획에 따라 작업이 진행되었나요?" option1="명확" option2="중간" option3="불명확" />
      </div>
      <div className="my-3">
        <Radios title="5. 이번 프로젝트가 본인의 경력에 도움이 될 것이라고 생각하나요?" option1="명확" option2="중간" option3="불명확" />
      </div>
      <div className="my-3">
        <Radios title="6. 개발 과정에서 본인의 권한과 자유도가 얼마나 있었나요?" option1="명확" option2="중간" option3="불명확" />
      </div>
      <div className="my-3">
        <Radios title="7. 계약서에 명시된 특약 사항 중 본인에게 불리한 조항이 있었나요?" option1="명확" option2="중간" option3="불명확" />
      </div>
      <div className="my-3 flex flex-col">
        <label htmlFor="">8. 클라이언트 한 줄 평가</label>
        <textarea className="border border-subTxt w-[300px] h-[40px] rounded-lg p-2 my-2" />
      </div>
      <div className="text-right mt-2">
        <Link to="/transfer">
          <DoneButton width={100} height={30} title="평가 완료" />
        </Link>
      </div>
    </div>
  )
}
export default FinalForm;