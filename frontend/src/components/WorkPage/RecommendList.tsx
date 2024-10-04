import { useEffect, useState } from "react";
import { recommendProject } from "../../apis/BoardApi";
import { recommend } from "../../apis/Board.type";
import { useNavigate } from "react-router-dom";
import RecommendWork from "./RecommendWork";

const RecommendList = () => {
  const navigate = useNavigate();
  const toWorkDetail = (id: number) => {
    navigate(`/work/detail/${id}`);
  }

  const [ recommendList, setRecommendList ] = useState<recommend[]>([]);

  const update = async () => {
    const data = await recommendProject();
    console.log("확인",data)
    setRecommendList(data)
  }

  useEffect(()=>{
      update();
  },[])

  return (
    <div>
        {recommendList?.map((recommend : recommend, index:number)=>(
            <div onClick={() => toWorkDetail(recommend.boardId)} key={index}>
              <RecommendWork {...recommend}/>
            </div>
          ))}
    </div>
  )
}
export default RecommendList;
