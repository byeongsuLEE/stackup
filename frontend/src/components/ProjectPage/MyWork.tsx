import { useEffect, useState } from "react";
import { project } from "../../apis/Board.type";
import AppliedBox from "./AppliedBox";
import { myBoard } from "../../apis/ClientApi";

const MyWork = () => {
  const [projectList, setProjectList] = useState<project[]>();

  useEffect(() => {
    const detail = async () => {
      const data = await myBoard();
      setProjectList(data);
    }
    detail();
  }, [])

  return (
    <div className="flex flex-col  items-center mt-[50px]">
      {projectList?.map((project: project, index: number) => (
        <div className="w-[1000px]" key={index}>
          <AppliedBox {...project} />
        </div>
      ))}
    </div>
  )
}
export default MyWork;