import axios from "axios"
import { freelanceBasicStore, freelanceLanguageStore } from "../store/FreelanceStore"
import { clientLoginInfo, clientSignupInfo } from "./User.type"

const BASE_URL: string = "http://localhost:8080/api/user"
const token: string ='수정'

//== 프리랜서 깃허브 소셜 로그인 ==//
export const freelanceLogin = async (): Promise<void> => {

    try{
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/social-auth/`
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

//== 프리랜서 정보 등록 ==//
export const freelanceInformation = async (): Promise<void> => {
    const basic = freelanceBasicStore.getState();
    const languageInfo = freelanceLanguageStore.getState();

    try {
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/info`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "name" : basic.name,
                "email" : basic.email,
                "address" : basic.address,
                "phone" : basic.phone,
                "classification" : languageInfo.classification,
                "framework" : languageInfo.frameworks,
                "language" : languageInfo.languages,
                "careerYear" : languageInfo.careerYear,
                "portfolioURL" : languageInfo.portfolioURL,
                "selfIntroduction" : languageInfo.selfIntroduction
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

//== 클라이언트 회원가입 ==//
export const clientSignup = async (information: clientSignupInfo): Promise<void> => {

    try {
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/client/signup`,
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
};

//== 클라이언트 로그인 ==//
export const clientLogin = async (information: clientLoginInfo): Promise<void> => {

    try {
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/client/login`,
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