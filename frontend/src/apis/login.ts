import axios from "axios"

const BASE_URL: string = "http://localhost:8080"

const freelanceLogin = async (): Promise<void> => {
    try{
        const response = await axios.post(`${BASE_URL}/api/user/social-auth/`)
        
        console.log(response.data)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }
    }
}

export default freelanceLogin