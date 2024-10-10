import { useState } from "react";
import DoneButton from "../common/DoneButton";
import CalenderRange from "./CalenderRange";
import { projectData } from "../../apis/Project.type";
import { useForm } from "react-hook-form";
import { previousProject } from "../../apis/ProjectApi";

const RegisterForm = () => {
  const { register, handleSubmit, setValue, watch } = useForm<projectData>({});
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  console.log(startDate, endDate)
  const projectFile = watch("projectFile");

  const handleStartDateChange = (newDate: string | null) => {
    const parsedDate = newDate ? new Date(newDate) : new Date(); // string을 Date로 변환
    setStartDate(parsedDate); // 상태 업데이트
    setValue("startDate", parsedDate); // Date 형식으로 저장
  };

  const handleEndDateChange = (newDate: string | null) => {
    const parsedDate = newDate ? new Date(newDate) : new Date(); // string을 Date로 변환
    setEndDate(parsedDate); // 상태 업데이트
    setValue("endDate", parsedDate); // Date 형식으로 저장
  };

  const onSubmit = (data: projectData) => {
    console.log("Form Data:", data);

    previousProject(data);

    if (projectFile && projectFile.length > 0) {
      // FileList에서 첫 번째 파일에 접근
      console.log("Uploaded File:", projectFile[0].name);
    } else {
      console.log("No file uploaded");
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="bg-bgGreen border flex flex-col border-mainGreen w-auto h-auto p-10 rounded-lg">
      <label htmlFor="projectName" className="text-sm">1. 프로젝트명</label>
      <input
        className="mt-3 px-2 w-[200px] ml-5 h-[30px] border border-subTxt rounded-lg"
        type="text"
        {...register("projectName", { required: '프로젝트명을 입력해주세요.' })}
      />

      <span className="text-sm mt-10">2. 프로젝트 기간</span>
      <div className="flex mt-3 items-center ml-5">
        <div className="mr-2">
          <CalenderRange title="시작일" onDateChange={handleStartDateChange} />
        </div>
        <div className="mx-2">
          <CalenderRange title="마감일" onDateChange={handleEndDateChange} />
        </div>
      </div>

      <label htmlFor="projectFile" className="text-sm mt-10">3. 프로젝트 증명서</label>
      <input
        type="file"
        className="file-input file-input-bordered ml-5 w-[400px] mt-3 h-[30px] max-w-xs"
        {...register("projectFile", { required: '프로젝트 증명서를 업로드해주세요.' })}
        multiple={false} // 한 개의 파일만 선택할 수 있도록 설정
/>

      <div className="text-right mt-3">
        <DoneButton width={100} height={30} title="등록하기" />
      </div>
    </form>
  );
};

export default RegisterForm;
