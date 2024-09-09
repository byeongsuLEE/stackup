import Detail from "../components/WorkPage/Detail";
import DetailSide from "../components/WorkPage/DetailSide";

const WorkDetail = () => {
  return (
    <div className="flex justify-center">
      <Detail />
      {/* 프리랜서 */}
      <DetailSide />
    </div>
  )
}

export default WorkDetail;
