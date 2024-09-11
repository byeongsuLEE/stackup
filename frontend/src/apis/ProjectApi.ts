import axios from "axios";
import { projectInformationProp } from "./Project.type";
import { projectFilterStore, projectListStore } from "../store/ProjectStore";

const BASE_URL: string = "http://localhost:8080";
// const token: string = "수정";

//== 프로젝트 목록 조회 ==//
export const allProject = async (): Promise<any> => {
    const setProjects = projectListStore.getState().setProjects;

    try {
        const response = await axios ({
            method: 'get',
            url: `${BASE_URL}/board`
        })
        
        setProjects(response.data.data)
        return response.data.data

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

          } else {
            console.error("Unexpected error: ", error);
          }

    }
}

//== 프로젝트 등록 ==//
export const createProject = async (data: projectInformationProp): Promise<void> => {

    try {
        const response = await axios ({
            method: 'post',
            url: `${BASE_URL}/board`,
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

        console.log(response.data);

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

          } else {
            console.error("Unexpected error: ", error);
          }

    }
}

//== 프로젝트 filter ==//
export const projectFilter = async (): Promise<void> => {

    const { classification, deposit, worktype } = projectFilterStore.getState();
    const setProjects = projectListStore.getState().setProjects;

    try {
        const response = await axios ({
            method: 'get',
            url: `${BASE_URL}/board/search`,
            params: {
                "worktype": worktype,
                "deposit": deposit,
                "classification": classification
            }
        })

        setProjects(response.data.data);

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);

          } else {
            console.error("Unexpected error: ", error);
          }

    }
}