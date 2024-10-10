import axios from "axios";
import { project } from "./Board.type";
import { projectData } from "./Project.type";

const svURL = import.meta.env.VITE_SERVER_URL;
const BASE_URL = `${svURL}/user/project`

//== 이전 프로젝트 등록 ==//
export const previousProject = async (data: projectData): Promise<void> => {
  console.log(data.startDate.toISOString())
  const formData = new FormData();
  formData.append("certificateFile", data.projectFile[0]);
  formData.append("title", data.projectName);
  formData.append("startDate", data.startDate.toISOString());
  formData.append("endDate", data.endDate.toISOString());

  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/previous-project`,
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
export const getProject = async (type: string): Promise<project[]> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/info`,
    params: {
      'projectType': type
    },
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    }
  })
  return response.data.data
}

// 프로젝트 시작하기
export const startProject = async (checkedList: number[], boardId: string): Promise<any> => {
  const response = await axios({
    method: 'post',
    url: `${BASE_URL}/start`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`
    },
    data: {
      "freelancerIdList": checkedList,
      "boardId": boardId
    }
  })
  
  return response.data.data
}

//프로젝트 단계 확인
export const checkProjectStep = async (projectId: number): Promise<any> => {
  try {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/${projectId}/step/check`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching project step:', error);
    throw error;  // 에러가 발생한 경우 예외를 다시 던짐
  }
}


//프로젝트 단계 변경
export const projectStep = async ( projectId?: number, currentStep?: string, isChangeProjectStep?: boolean ): Promise<any> => {
  try {
    const response = await axios({
      method: 'patch',
      url: `${BASE_URL}/${projectId}/step/check`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',  // 'ContentType'을 'Content-Type'으로 수정
      },
      data: {
        currentStep: currentStep,  // 단계 변경 정보
        isChangeProjectStep: isChangeProjectStep,  // 단계 변경 여부
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating project step:', error);
    throw error;  // 에러가 발생한 경우 예외를 다시 던짐
  }
};

// 프로젝트 상세 정보 가져오기
export const contractProjectDetail = async (projectId?: any): Promise<any> => {
  try {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/info/${projectId}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    return response.data?.data || response.data; // data에 있는 값이 없는 경우 처리
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error; // 오류 처리
  }

};