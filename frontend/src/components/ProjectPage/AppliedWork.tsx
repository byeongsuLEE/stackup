import { useEffect, useState } from "react";
import { appliedProject } from "../../apis/FreelancerApi";
import { project } from "../../apis/Board.type";
import AppliedBox from "./AppliedBox";

const AppliedWork = () => {
  const [projectList, setProjectList] = useState<project[]>();

  useEffect(() => {
    const detail = async () => {
      const data = await appliedProject();
      setProjectList(data);
    }
    detail();
  }, [])

  return (
    <div className="flex flex-col  items-center mt-[50px]">
      {projectList?.length === 0 && <div>지원한 프로젝트가 없습니다.</div>}
      {projectList?.map((project: project, index: number) => (
        <div className="w-[1000px]" key={index}>
          <AppliedBox {...project} />
        </div>
      ))}
    </div>
  )
}
export default AppliedWork;