import { useEffect, useState } from "react";
import { recommendProject } from "../../apis/BoardApi";
import { recommend } from "../../apis/Board.type";
import { useNavigate } from "react-router-dom";
import RecommendWork from "./RecommendWork";
import { freelanceStore } from "../../store/FreelanceStore";

const RecommendList = () => {
  const navigate = useNavigate();
  const toWorkDetail = (id: number) => {
    navigate(`/work/detail/${id}`);
  }

  const [recommendList, setRecommendList] = useState<recommend[]>([]);

  const update = async () => {
    const data = await recommendProject();
    console.log("확인", data)
    setRecommendList(data)
  }

  useEffect(() => {
    update();
  }, [])

  const name = freelanceStore((state) => state.name); 

  return (
    <div>
      <span className="text-start">{name}님을 위한 추천 프로젝트</span>
      <div className="flex flex-row flex-wrap gap-4">
        {recommendList?.map((recommend: recommend, index: number) => (
          <div
            onClick={() => toWorkDetail(recommend.boardId)}
            key={index}
            className="cursor-pointer"
          >
            <RecommendWork {...recommend} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default RecommendList;
