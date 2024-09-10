import { useNavigate } from "react-router-dom";

const ContractDone = () => {
  const navigate = useNavigate();
  const toProjectDetail = () => {
    navigate('/project/detail');
  }
  return (
    <div onClick={toProjectDetail} className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 pt-10 px-5 h-[200px] flex flex-col">
        <ul className="steps">
          <li className="step step-success"></li>
          <li className="step step-success"></li>
          <li className="step"></li>
          <li className="step"></li>
          <li className="step"></li>
        </ul>
      <div className="flex flex-col ml-5">
        <span className="text-lg mt-6">프로젝트명</span>
        <span className="text-sm text-subTxt my-2">프로젝트 기간</span>
      </div>

    </div>
  )
}
export default ContractDone;