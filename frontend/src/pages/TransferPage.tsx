import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { contractData } from "../apis/ContractApi";
import TransferBox from "../components/TransferPage/TransferBox";
import DoneButton from "../components/common/DoneButton";
import InputPassword from "../components/common/InputPassword";

const Transfer = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const {  userId, boardId, stepResponse, freelancerProjectId } = location.state;
  const [total, setTotal] = useState<number>(0);
  const [mid, setMid] = useState<number>(0);
  const [final, setFinal] = useState<number>(0);
  const [showKeypad, setShowKeypad] = useState(false);
  // const userId = sessionStorage.getItem('freelancerId');
  const NumericUserId = Number(userId)

  const handleShowKeypad = () => {
    setShowKeypad(true);
  };

  useEffect(() => {
    const update = async () => {
      const data = await contractData(freelancerProjectId);
      setTotal(data.contractTotalAmount * 10000);
      setMid(data.contractDownPayment * 10000);
      setFinal(data.contractFinalPayment * 10000);
    }

    update();
  }, [])


  return (
    <div className="m-40">
      <TransferBox totalAmount={total} middleAmount={mid} />
      <div className="flex flex-col items-end my-5 mx-5 ">
        {stepResponse === 'DEVELOPMENT' ? (
          <span className="mb-10 font-bold">송금 금액:  ￦ {mid.toLocaleString('ko-KR')} 원</span>
        ) : (
          <span className="mb-10 font-bold">송금 금액:  ￦ {final.toLocaleString('ko-KR')} 원</span>
        )}

        <div onClick={handleShowKeypad}>
          <DoneButton width={100} height={30} title="송금하기" />
        </div>
        {showKeypad && <InputPassword middleAmount={mid} finalAmount={final} userId={NumericUserId} stepResponse={stepResponse} projectId={projectId} boardId={boardId} />}
      </div>
    </div>
  )
}
export default Transfer;