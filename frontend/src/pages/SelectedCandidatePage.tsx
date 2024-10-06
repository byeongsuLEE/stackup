import SelectedCandidateList from "../components/SelectedCandidatePage/SelectedCandidateList";

const SelectedCandidate = () => {

  return (
    <div className="m-10">
      <span className="font-bold text-subGreen1 text-lg">프리랜서 관리</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
      <SelectedCandidateList />
    </div>
  )
}

export default SelectedCandidate;