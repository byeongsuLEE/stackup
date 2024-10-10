import { useNavigate } from "react-router-dom";
import { allProject, projectFilter } from "../../apis/BoardApi";
import { projectFilterStore } from "../../store/ProjectStore";
import { project } from "../../apis/Board.type";
import { useEffect, useState } from "react";
import Work from "./Work";
import { Pagination } from "@mui/material";


const WorkList = () => {
  const [page, setPage] = useState(0); // 페이지를 0부터 시작하도록 수정
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5; // 페이지 당 항목 수 설정
  const [projectList, setProjectList] = useState<project[]>([]);
  const navigate = useNavigate();
  const toWorkDetail = (boardId: string) => {
    navigate(`/work/detail/${boardId}`);
  }

  const update = async () => {
    const {data, totalPages} = await allProject(page, itemsPerPage);
    setProjectList(data)
    setTotalPages(totalPages);
  }
  useEffect(() => {
    update();
  }, [page])

  //== projectList 반환 ==//
  const state = projectFilterStore();

  //== 값 변경 후 api 요청 ==//
  const choice = (value: string | null, category: string) => {
    if (value === "null") {
      value = null
    }

    if (category === "classification") {
      state.setClassification(value)

    } else if (category === "workType") {
      state.setWorktype(value)

    } else {
      state.setDeposit(value)
    }

    const filter = async () => {
      const filterList = await projectFilter();
      setProjectList(filterList);
    }

    filter();
  }

  // 페이지 변경 핸들러
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1); // 페이지 번호를 0부터 시작하도록 조정
  }

  return (
    <div>
      <span className="font-bold text-xl text-subGreen1">프로젝트 찾기</span>

      <div className="mt-5">
        <select
          defaultValue="classification"
          className="bg-bgGreen text-center text-sm mx-2 border border-mainGreen w-[90px] h-[30px] rounded-2xl"
          name="category"
          onChange={(e) => choice(e.target.value, "classification")}
        >
          <option value="null">대분류</option>
          <option value="web">웹</option>
          <option value="mobile">모바일</option>
          <option value="publisher">퍼블리셔</option>
          <option value="ai">AI</option>
          <option value="db">DB</option>
        </select>

        <select
          defaultValue="workType"
          className="bg-bgGreen mx-2 text-center text-sm border border-mainGreen w-[90px] h-[30px] rounded-2xl"
          name="category"
          onChange={(e) => choice(e.target.value, "workType")}
        >
          <option value="null">근무형태</option>
          <option value="true">재택</option>
          <option value="false">기간제 상주</option>
        </select>

        <select
          defaultValue="budget"
          className="bg-bgGreen mx-2 text-center text-sm border border-mainGreen w-[90px] h-[30px] rounded-2xl"
          name="category"
          onChange={(e) => choice(e.target.value, "budget")}
        >
          <option value="null">금액</option>
          <option value="1">500만원 미만</option>
          <option value="2">500만원~1,000만원</option>
          <option value="3">1,000만원~5,000만원</option>
          <option value="4">5,000만원~1억원</option>
          <option value="5">1억원 이상</option>
        </select>
      </div>

      {projectList?.map((project: project, index: number) => (
        <div onClick={() => toWorkDetail(project.boardId)} className="mb-10" key={index}>
          <Work {...project} />
        </div>
      ))}

      {/* 페이징 컴포넌트 */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  )
}
export default WorkList;
