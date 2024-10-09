
interface TransferBoxProps {
  totalAmount?: number;
  middleAmount?: number;
}
const TransferBox = ({ totalAmount = 0, middleAmount = 0 }: TransferBoxProps) => {
  const finalAmount = totalAmount - middleAmount;
  const setFinalAmount = finalAmount.toLocaleString('ko-KR');
  const setTotalAmount = totalAmount.toLocaleString('ko-KR');
  const setMiddleAmount = middleAmount.toLocaleString('ko-KR');
 
  return (
    <div className="bg-bgGreen border border-mainGreen rounded-lg flex justify-between w-auto h-auto py-10 px-40" my-10>
      <div className="flex flex-col">
        <span>계약 금액: </span>
        <span>중간 정산 금액: </span>
        <span>최종 결제 금액: </span>
      </div>
      <div className="flex">
      <div className="flex flex-col font-bold mr-2">
        <span>￦</span>
        <span>￦</span>
        <span>￦</span>
      </div>
      <div className="flex flex-col font-bold text-end">
        <span>{setTotalAmount}원</span>
        <span>{setMiddleAmount}원 </span>
        <span>{setFinalAmount}원 </span>
      </div>
      </div>

    </div>
  )
}
export default TransferBox;