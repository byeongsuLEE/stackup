import { useNavigate } from "react-router-dom";
import WebIcon from "../../icons/WebIcon";

const ContractIng = () => {
  const navigate = useNavigate();
  const toProjectDetail = () => {
    navigate('/work/detail');
  }
  return (
    <div onClick={toProjectDetail} className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 p-10 h-[200px] flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-lg">프로젝트명</span>
        <span className="text-sm text-subTxt my-2">프로젝트 기간</span>
        <span>대분류</span>
      </div>
      <div>
        <WebIcon w={30} h={30} />
      </div>
    </div>
  )
}
export default ContractIng;