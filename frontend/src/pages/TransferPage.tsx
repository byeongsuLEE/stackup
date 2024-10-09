import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { contractProjectDetail } from "../apis/ProjectApi";
import TransferBox from "../components/TransferPage/TransferBox";
import DoneButton from "../components/common/DoneButton";

const Transfer = () => {
  const projectId = useParams<{ projectId: string }>().projectId;
  const numericProjectId = Number(projectId);
  useEffect(() => {
    if (projectId) {
      const response = contractProjectDetail(numericProjectId);
      console.log(response);
    }
  }, []);

  return (
    <div className="m-40">
      <TransferBox totalAmount={15000000} middleAmount={5000000} />
      <div className="flex flex-col items-end my-5 mx-5 ">
        <span className="mb-10 font-bold">송금 금액:  ￦ 10,000,000원</span>
        <DoneButton width={100} height={30} title="송금하기" />
      </div>
    </div>
  )
}
export default Transfer;