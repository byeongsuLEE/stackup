import MitermForm from "../components/MitermEvaluatePage/MitermForm";

const MitermEvaluate = () => {
  return (
    <div className="m-20">
      <div className="flex flex-col">
      <span className="text-subGreen1 text-lg mb-1 font-bold">중간 평가</span>
      <span className="text-sm text-subTxt ml-2 mt-2">중간 평가는 상대방의 평점에 반영됩니다.</span>
      <div className="bg-subTxt h-[1px] w-auto mt-5"></div>
      <MitermForm/>
      </div>
    </div>
  )
}
export default MitermEvaluate;