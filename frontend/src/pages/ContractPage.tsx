import ContractDetail from "../components/ContractPage/ContractDetail";

const Contract =()=>{
  return (
    <div className="m-10">
    <span className="font-bold text-subGreen1 text-lg">계약 페이지</span>
    <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
    <ContractDetail />
  </div>
  )
}
export default Contract;