import { Link } from "react-router-dom";
import ContractDetail from "../components/ContractPage/ContractDetail";
import DoneButton from "../components/common/DoneButton";

const Contract = () => {


  return (
    <div className="my-20">
      <span className="font-bold text-subGreen1 text-lg">계약 페이지</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
      <div></div>
      <ContractDetail/>
      <Link to="/signature">
        <div className="mt-5 text-end mr-10">
          <DoneButton height={30} width={150} title="제출" />
        </div>
      </Link>
    </div>
  )
}
export default Contract;