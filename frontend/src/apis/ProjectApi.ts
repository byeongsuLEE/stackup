import axios from "axios"
import { projectData } from "./Project.type"

const BASE_URL: string = "http://localhost:8080/api"

//== 이전 프로젝트 등록 ==//
export const previousProject = async (data: projectData): Promise<void> => {
  console.log(typeof data.projectFile);

  const formData = new FormData();
  formData.append("certificateFile", data.projectFile[0]);
  formData.append("title", data.projectName);
  formData.append("period", '10');
  // formData.append("endDate", data.endDate);

  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/project/previous-project`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });

    console.log(response.data);
  } catch (error) {
    console.error('파일 업로드 중 에러 발생:', error);
  }
};

//== 프로젝트 가져오기 ==//
export const getProject =  async (type: string): Promise<void> => {
  const response = await axios({
    method:'get',
    url: `${BASE_URL}/project/info`,
    params: {
      'projectType': type
    },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })

  console.log(response.data)
}

// 프로젝트 시작하기
export const startProject = async (checkedList: Number[], boardId: string): Promise<void> => {

  const response = await axios({
    method: 'post',
    url: `${BASE_URL}/project/start`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    data: {
      "freelancerIdList" : checkedList,
      "boardId" : boardId
    }
  })

  console.log(response.data)
}