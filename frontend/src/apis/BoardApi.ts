import axios from "axios";
import { projectFilterStore } from "../store/ProjectStore";
import { createProjectProp, project, projectApplicantProps, recommend } from "./Board.type";

const svURL = import.meta.env.VITE_SERVER_URL;
const BASE_URL = `${svURL}/board`

//== 프로젝트 목록 조회 ==//
export const allProject = async (
  page: number,
  size: number
): Promise<{ data: project[]; totalPages: number }> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      params: {
        page,
        size,
      },
    });

    return {
      data: response.data.content,
      totalPages: response.data.totalPages,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
    return {
      data: [],
      totalPages: 0,
    };
  }
};

//== 프로젝트 등록 ==//
export const createProject = async (data: createProjectProp): Promise<void> => {
  // 데이터 변환
  const frameworks = data.frameworks.map((framework) => ({ frameworkId: framework }));
  const languages = data.languages.map((language) => ({ languageId: language }));

  axios({
    method: "post",
    url: BASE_URL,
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
    data: {
      title: data.title,
      description: data.description,
      classification: data.classification,
      frameworks: frameworks,
      languages: languages,
      deposit: data.deposit,
      startDate: data.startDate,
      period: data.period,
      level: data.level,
      recruits: parseInt(data.recruits, 10),
      worktype: data.workType,
      requirements: data.requirements,
      address: data.address,
      deadline: data.deadline,
    },
  }).catch((error) => {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  });
};

//== 프로젝트 filter ==//
export const projectFilter = async (): Promise<any> => {
  const { classification, deposit, worktype } = projectFilterStore.getState();

  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/search`,
      params: {
        worktype: worktype,
        deposit: deposit,
        classification: classification,
      },
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }
};

//== 특정 프로젝트 조회 ==//
export const projectDetail = async (boardId?: string): Promise<any> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/${boardId}`,
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }
};

//== 추천 프로젝트 목록 조회 ==//
export const recommendProject = async (): Promise<recommend[]> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/recommend`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }

    return [];
  }
};

// 프로젝트 지원자 조회
export const projectApplicant = async (boardId?: string): Promise<projectApplicantProps[]> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/${boardId}/applicant-list`,
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
    return [];
  }
};

// 게시글 삭제
export const projectDelete = async (boardId: string): Promise<void> => {
  try {
    await axios({
      method: "delete",
      url: `${BASE_URL}/${boardId}`,
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    });
    window.location.href = "/work";
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }
};

// 프로젝트 프리랜서 리스트 조회
export const projectFreelancer = async (boardId: string): Promise<any> => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/${boardId}/selected-applicant-list`,
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
    } else {
      console.error("Unexpected error: ", error);
    }
  }
};
