import { project } from "../../apis/Board.type";

const RegisteredCareer = (project: project) => {

  const start = new Date(project.previousProjectStartDate).toISOString().split('T')[0];
  const end = new Date(project.previousProjectEndDate).toISOString().split('T')[0];
  
  return (
    <div>
      <div className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 p-10 h-[200px] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg">{project.title}</span>
              <span className="text-sm text-subTxt my-2">
                {start} - {end}
              </span>
            </div>
          </div>
    </div>
  )
}
export default RegisteredCareer;