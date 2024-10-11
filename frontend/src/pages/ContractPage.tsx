import { useRef } from "react";
import ContractDetail from "../components/ContractPage/ContractDetail";
import DoneButton from "../components/common/DoneButton";
import { signature, submitContract } from "../apis/ContractApi";
import { useNavigate, useParams } from "react-router-dom";
import { MakeSign } from "../hooks/MakeSign";

interface ContractDetailComponentType {
  getContractData: () => any;
}

const Contract = () => {
  const navigate = useNavigate();
  const { signMessage } = MakeSign();
  const { boardId, projectId, freelancerProjectId } = useParams();
  const contractDetailRef = useRef<ContractDetailComponentType | null>(null);
  
  const handleSubmit = async () => {
    if(contractDetailRef.current){
      const data = contractDetailRef.current.getContractData();
      await submitContract(data, freelancerProjectId);

      const sign = await signMessage();
      
      if (sign) {
        await signature(sign.signedMessage, freelancerProjectId);
        navigate(`/work/detail/select/${boardId}/${projectId}`);
      }
    }
  };

  return (
    <div className="my-20">
      <span className="font-bold text-subGreen1 text-lg">계약 페이지</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>

      <ContractDetail ref={contractDetailRef} />

      <div className="mt-5 text-end mr-10" onClick={handleSubmit}>
        <DoneButton height={30} width={150} title="서명 제출" />
      </div>
    </div>
  );
};

export default Contract;