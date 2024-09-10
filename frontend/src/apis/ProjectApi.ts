import axios from "axios";
import { projectInformationProp } from "./Project.type";

const BASE_URL: string = "http://localhost:8080";
// const token: string = "수정";

export const createProject = async (information: projectInformationProp): Promise<void> => {

    try {
        const response = await axios ({
            method: 'post',
            url: `${BASE_URL}/board`,
            data: {
                "title": information.title,
                "description": information.description,
                "classification": information.classification,
                "framework": information.frameworks,
                "language": information.languages,
                "deposit": information.deposit,
                "startDate": information.startDate,
                "period": information.period,
                "recruits": parseInt(information.recruits, 10),
                "worktype": information.workType,
                "requirements": information.requirements,
                "address": information.address,
                "deadline": information.deadline
            }
        })

        console.log(response.data)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);
          } else {
            console.error("Unexpected error: ", error);
          }
    }
}