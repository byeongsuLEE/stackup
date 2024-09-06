import axios from "axios"
import { clientLoginInfo, clientSignupInfo } from "./user.type"

const BASE_URL: string = "http://localhost:8080"

//== 프리랜서 깃허브 소셜 로그인 ==//
export const freelanceLogin = async (): Promise<void> => {

    try{
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/api/user/social-auth/`
        })
        
        console.log(response.data)

    } catch(error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }
    }
}

//== 클라이언트 회원가입 ==//
export const clientSignup = async (information: clientSignupInfo): Promise<void> => {

    try {
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/api/user/client/signup`,
            data: {
                name: information.name,
                email: information.email,
                password: information.password,
                passwordCheck: information.passwordCheck,
                businessRegistrationNumber: information.businessRegistrationNumber,
                businessName: information.businessName,
                phone: information.phone
            }
        })

        console.log(response.data)

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }
    }
}

//== 클라이언트 로그인 ==//
export const clientLogin = async (information: clientLoginInfo): Promise<void> => {

    try {
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/api/user/client/login`,
            data: {
                email: information.email,
                password: information.password
            }
        })

        console.log(response.data)

    } catch(error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }
    }
}