import DoneButton from "../common/DoneButton";
import Radios from "../common/Radios";

const MitermForm = () => {
  return (
    <div className="bg-bgGreen border flex flex-col border-mainGreen h-auto w-auto mt-10 p-10 rounded-lg">
      <div className="my-3">
      <Radios title="1. 응답시간" option1="빠름" option2="중간" option3="느림"/>
      </div>
      <div className="my-3">
      <Radios title="2. 요구사항 변경 빈도" option1="적음" option2="중간" option3="많음"/>
      </div>
      <div className="my-3">
      <Radios title="3. 요구사항 명확성" option1="명확" option2="중간" option3="불명확"/>
      </div>
      <div className="text-right mt-2">
      <DoneButton width={100} height={30} title="평가 완료"/>
      </div>
    </div>
  )
}
export default MitermForm;