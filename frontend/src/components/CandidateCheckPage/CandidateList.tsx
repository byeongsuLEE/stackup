import Candidate from "./Candidate";

const CandidateList = () => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>채용 여부</th>
            <th>이름</th>
            <th>평점</th>
            <th>포트폴리오</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <Candidate name="이호영" ischecked={true} portfolio="github.com/hoyoung" rating={5.0} />
        </tbody>
      </table>
    </div>
  )
}
export default CandidateList;