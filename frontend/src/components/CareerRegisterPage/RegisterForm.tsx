import DoneButton from "../common/DoneButton";
import CalenderRange from "./CalenderRange";
import { projectData } from "../../apis/Project.type";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const { register, setValue } = useForm<projectData>({});

  return (
    <div className="bg-bgGreen border flex flex-col border-mainGreen w-auto h-auto p-10 rounded-lg">
      <label htmlFor="projectName" className="text-sm">1. 프로젝트명</label>
      <input
      // name="projectName"
      className="mt-3 px-2 w-[200px] ml-5 h-[30px] border border-subTxt rounded-lg"
      type="text"
      {...register("projectName", { required: '프로젝트명을 입력해주세요.'})}
      />
      
      <span className="text-sm mt-10">2. 프로젝트 기간</span>
      <div className="flex mt-3 items-center ml-5">
      <div className="mr-2">
      <CalenderRange title="시작일"/>
      </div>
      <div className="mx-2">
      <CalenderRange title="마감일"/>
      </div>
      </div>

      <label htmlFor="projectFile" className="text-sm mt-10">3. 프로젝트 증명서</label>
      <input type="file" className="file-input file-input-bordered ml-5 w-[400px] mt-3 h-[30px] max-w-xs" />

      <div className="text-right mt-3" >
      <DoneButton width={100} height={30} title="등록하기"/>
      </div>
    </div>
  )
}
export default RegisterForm;