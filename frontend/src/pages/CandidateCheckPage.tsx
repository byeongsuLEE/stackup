import CandidateList from "../components/CandidateCheckPage/CandidateList";

const CandidateCheck = () => {

  return (
    <div className="m-10">
      <span className="font-bold text-subGreen1 text-lg">지원자 관리</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
      <CandidateList />
    </div>
  )
}

export default CandidateCheck;