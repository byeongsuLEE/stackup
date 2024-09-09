import Detail from "../components/WorkDetailPage/Detail";
import DetailSide from "../components/WorkDetailPage/DetailSide";

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
