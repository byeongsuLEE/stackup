import { useNavigate } from "react-router-dom";
import Work from "./Work";

const WorkList = () => {
  const navigate = useNavigate();
  const toWorkDetail = () => {
    navigate('/work/detail');
  }
  return (
    <div className="mx-10">
      <span className="font-bold text-xl">프로젝트 찾기</span>

      <div className="mt-5">
      <select defaultValue="category" className="bg-bgGreen text-center text-sm mx-2 border border-mainGreen w-[90px] h-[30px] rounded-2xl" name="category">
        <option value="category">대분류</option>
        <option value="web">웹</option>
        <option value="mobile">모바일</option>
        <option value="publisher">퍼블리셔</option>
        <option value="ai">AI</option>
        <option value="db">DB</option>
      </select>

      <select defaultValue="workType" className="bg-bgGreen mx-2 text-center text-sm border border-mainGreen w-[90px] h-[30px] rounded-2xl" name="category">
        <option value="workType">근무형태</option>
        <option value="home">재택</option>
        <option value="commute">기간제 상주</option>
      </select>

      <select defaultValue="budget" className="bg-bgGreen mx-2 text-center text-sm border border-mainGreen w-[90px] h-[30px] rounded-2xl" name="category">
        <option value="budget">금액</option>
       
      </select>
      </div>

      <div onClick={toWorkDetail} className="mb-10">
        <Work title="프로젝트이름" company="ssafy" period="2024-09-01~2024-09-31" budget={1000000} category="웹" candidate={2} candidateTotal={5} deadline={3} rating={4.6} />
      </div>
    </div>
  )
}
export default WorkList;
