import axios from "axios"
import { projectData } from "./Project.type"

const BASE_URL: string = "http://localhost:8080/api"

//== 이전 프로젝트 등록 ==//
export const previousProject = async (data: projectData): Promise<void> => {
  console.log(typeof data.projectFile); // 파일 타입 확인

  const formData = new FormData();
  formData.append("certificateFile", data.projectFile[0]); // projectFile이 FileList라고 가정
  formData.append("title", data.projectName);
  formData.append("period", '10');
  // formData.append("endDate", data.endDate);

  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/project/previous-project`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data', // 파일 업로드를 위해 필수
      },
      data: formData, // JSON 대신 FormData 사용
    });

    console.log(response.data);
  } catch (error) {
    console.error('파일 업로드 중 에러 발생:', error);
  }
};

//== 프로젝트 가져오기 ==//
export const getProject =  async (): Promise<void> => {
  const response = await axios({
    method:'get',
    url: `${BASE_URL}/project/info`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })

  console.log(response.data)
}