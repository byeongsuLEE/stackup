import { useEffect, useState } from "react";
import { recommendProject } from "../../apis/BoardApi";
import { recommend } from "../../apis/Board.type";
import { useNavigate } from "react-router-dom";
import RecommendWork from "./RecommendWork";
import { freelanceStore } from "../../store/FreelanceStore";
import { freelanceMypage } from "../../apis/UserApi";

const RecommendList = () => {
  const navigate = useNavigate();
  const toWorkDetail = (id: number) => {
    navigate(`/work/detail/${id}`);
  }

  const [recommendList, setRecommendList] = useState<recommend[]>([]);

  const update = async () => {
    const data = await recommendProject();
    setRecommendList(data)
  }

  useEffect(() => {
    update();
    freelanceMypage();
  }, [])

  const name = freelanceStore((state) => state.name); 
  
  return (
    <div>
      <span className="text-start">
        <span className="font-bold text-subGreen1">
          {name}
          </span>
           님을 위한 추천 프로젝트
      </span>

      <div className="flex overflow-x-auto space-x-4 py-4 scrollbar">
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
