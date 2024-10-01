import { useEffect } from "react";
import { getProject } from "../../apis/ProjectApi";
import SignListBox from "./SignListBox";


const SignList = () => {
  useEffect(() => {
    getProject();
  }, [])

  return (
    <div className="flex flex-col w-[1000px] items-center mt-[50px]">
      <SignListBox title="프로젝트명" period="2024-09-01~2024-09-30" company="ssafy" />
    </div>
  )
}

export default SignList;