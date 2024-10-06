import { useRef } from "react";
import ContractDetail from "../components/ContractPage/ContractDetail";
import DoneButton from "../components/common/DoneButton";
import { submitContract } from "../apis/ContractApi";
import { useParams } from "react-router-dom";

interface ContractDetailComponentType {
  getContractData: () => any; // 필요한 타입으로 반환 타입을 변경하세요.
}

const Contract = () => {
  const { boardId, freelancerProjectId } = useParams();
  const contractDetailRef = useRef<ContractDetailComponentType | null>(null);


  const handleSubmit = async () => {
    if(contractDetailRef.current){
    const data = contractDetailRef.current.getContractData()
    submitContract(data, freelancerProjectId);
    }
  };

  return (
    <div className="my-20">
      <span className="font-bold text-subGreen1 text-lg">계약 페이지</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>

      <ContractDetail ref={contractDetailRef} />

      <div className="mt-5 text-end mr-10" onClick={handleSubmit}>
        <DoneButton height={30} width={150} title="제출" />
      </div>
    </div>
  );
};

export default Contract;