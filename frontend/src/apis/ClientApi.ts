import axios from "axios";
import { project } from "./Board.type";
import { candidate } from "./Freelancer.type";

const BASE_URL: string = "http://localhost:8080/api/board";

//== 선택된 지원자 리스트 ==//
export const selectedCandidate = async (boardId?: string): Promise<candidate[]> => {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/${boardId}/selected-applicant-list`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
  
    return response.data;
  }

  //== 내가 게시한 프로젝트 ==//
  export const myBoard = async (): Promise<project[]> => {
    const response = await axios({
        method: 'get',
        url: `${BASE_URL}/client/${sessionStorage.getItem('clientId')}`,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })

    return response.data.data;
  }

  