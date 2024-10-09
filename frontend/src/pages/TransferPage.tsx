import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TransferBox from "../components/TransferPage/TransferBox";
import DoneButton from "../components/common/DoneButton";
import { contractData } from "../apis/ContractApi";

const Transfer = () => {
  const location = useLocation();
  const { stepResponse, freelancerProjectId } = location.state;
  const [ total, setTotal ] = useState<number>(0);
  const [ mid, setMid ] = useState<number>(0);
  const [ final, setFinal ] = useState<number>(0);

  useEffect(() => {
    const update = async() => {
      const data = await contractData(freelancerProjectId);
      setTotal(data.contractTotalAmount * 10000);
      setMid(data.contractDownPayment * 10000);
      setFinal(data.contractFinalPayment * 10000);
    }

    update();
  }, [])

  const handleTransfer = async() => {
    
  }

  return (
    <div className="m-40">
      <TransferBox totalAmount={total} middleAmount={mid} />
      <div className="flex flex-col items-end my-5 mx-5 ">
        <span className="mb-10 font-bold">송금 금액:  ￦ {mid.toLocaleString('ko-KR')} 원</span>
        <div onClick={handleTransfer}>
          <DoneButton width={100} height={30} title="송금하기" />
        </div>
      </div>
    </div>
  )
}
export default Transfer;