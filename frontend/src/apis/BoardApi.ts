import axios from "axios";
import { projectFilterStore } from "../store/ProjectStore";
import { createProjectProp, project } from "./Board.type";

const BASE_URL: string = "http://localhost:8080/api/board";

//== 프로젝트 목록 조회 ==//
export const allProject = async (): Promise<project[]> => {
    try {
        const response = await axios({
            method: 'get',
            url: BASE_URL,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        console.log(response.data)
        return response.data.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

        } else {
            console.error("Unexpected error: ", error);
        }

        return [];
    }
}

//== 프로젝트 등록 ==//
export const createProject = async (data: createProjectProp): Promise<void> => {

    axios({
        method: 'post',
        url: BASE_URL,
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem('token')}`
        },
        data: {
            "title": data.title,
            "description": data.description,
            "classification": data.classification,
            "framework": data.frameworks,
            "language": data.languages,
            "deposit": data.deposit,
            "startDate": data.startDate,
            "period": data.period,
            "recruits": parseInt(data.recruits, 10),
            "worktype": data.workType,
            "requirements": data.requirements,
            "address": data.address,
            "deadline": data.deadline
        }
    })
    .catch((error) => {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

        } else {
            console.error("Unexpected error: ", error);
        }
    })

}

//== 프로젝트 filter ==//
export const projectFilter = async (): Promise<any> => {

    const { classification, deposit, worktype } = projectFilterStore.getState();

    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/search`,
            params: {
                "worktype": worktype,
                "deposit": deposit,
                "classification": classification
            }
        })

        return response.data.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

        } else {
            console.error("Unexpected error: ", error);
        }

    }
}

//== 특정 프로젝트 조회 ==//
export const projectDetail = async (boardId?: string): Promise<any> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/${boardId}`
        })
        
        return response.data.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

        } else {
            console.error("Unexpected error: ", error);
        }
    }
}