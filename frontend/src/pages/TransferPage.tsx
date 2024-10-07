import TransferBox from "../components/TransferPage/TransferBox";
import DoneButton from "../components/common/DoneButton";

const Transfer = () => {
  return (
    <div className="m-40">
      <TransferBox totalAmount={15000000} middleAmount={5000000} />
      <div className="items-end my-5 mx-5 flex flex-col">
      <span className="mb-10 font-bold">송금 금액:  ￦ 10,000,000원</span>
      <DoneButton width={100} height={30} title="송금하기"/>
      </div>
    </div>
  )
}
export default Transfer;