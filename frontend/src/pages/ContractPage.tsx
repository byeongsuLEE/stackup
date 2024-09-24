import ContractDetail from "../components/ContractPage/ContractDetail";

const Contract =()=>{
  return (
    <div className="m-20">
    <span className="font-bold text-subGreen1 text-lg mx-24">계약 페이지</span>
    <div className="bg-subTxt mx-20 w-auto h-[1px] flex justify-center my-5"></div>
    <ContractDetail />
  </div>
  )
}
export default Contract;