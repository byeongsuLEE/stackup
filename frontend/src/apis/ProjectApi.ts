import axios from "axios"

const BASE_URL: string = "http://localhost:8080/api/project"

export const previousProject = async (): Promise<void> => {
    const response = await axios({
        method:'post',
        url:`${BASE_URL}/previous-project`,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        },
        data: {
              
        }
    })
}