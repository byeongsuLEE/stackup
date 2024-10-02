import { useEffect, useState } from "react";
import { appliedProject } from "../../apis/FreelancerApi";
import AppliedBox from "./AppliedBox";

const AppliedWork = () => {
  const [projectList, setProjectList] = useState();

  useEffect(() => {
    const detail = async () => {
      const data = await appliedProject();
      setProjectList(data);
      console.log(data);
    }
    detail();
  }, [])

  return (
    <div className="flex flex-col w-[1000px] items-center mt-[50px]">
      <AppliedBox title="프로젝트명" period="2024-09-01~2024-09-30" company="ssafy" />
    </div>
  )
}
export default AppliedWork;