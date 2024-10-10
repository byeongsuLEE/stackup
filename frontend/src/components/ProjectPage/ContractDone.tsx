import { useEffect, useState } from "react";
import { project } from "../../apis/Board.type";
import { getProject } from "../../apis/ProjectApi";
import ContractDoneBox from "./ContractDoneBox";

const ContractDone = () => {
  const [projectList, setprojectList] = useState<project[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProject('PROGRESS');
        setprojectList(response);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, []);

  return (
    <>
      {projectList?.length === 0 && <div>진행중인 프로젝트가 없습니다.</div>}
      {projectList?.map((project: project, index: number) => (
        <div className="w-[1000px]" key={index}>
          <ContractDoneBox {...project} />
        </div>
      ))}
    </>
  )
}
export default ContractDone;