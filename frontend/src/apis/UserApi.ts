import axios from "axios"
import { freelanceStore } from "../store/FreelanceStore"
import { clientLoginInfo, clientSignupInfo } from "./User.type"

const BASE_URL: string = "http://localhost:8080/api/user"
let token: string = '수정'

//== 프리랜서 깃허브 소셜 로그인 ==//
export const freelanceLogin = async (): Promise<void> => {
    window.location.href = "http://localhost:8080/api/freelancer/login";

    // axios({
    //     method: 'post',
    //     url: 'http://localhost:8080/api/freelancer/login'
    // })
    // .then((response) => {
    //     console.log(response.data)
    // })
    // .catch((error) => {
    //     console.log(error)
    // })
}

//== 프리랜서 정보 등록 ==//
export const freelanceInformation = async (): Promise<void> => {
    const state = freelanceStore.getState();

    try {
        const response = await axios({
            method: "post",
            url: `${BASE_URL}/info`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "name": state.name,
                "email": state.email,
                "address": state.address,
                "phone": state.phone,
                "classification": state.classification,
                "framework": state.frameworks,
                "language": state.languages,
                "careerYear": state.careerYear,
                "portfolioURL": state.portfolioURL,
                "selfIntroduction": state.selfIntroduction
            }
        })

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }
    }
}

//== 마이페이지 정보 ==//
export const freelanceMypage = async (): Promise<void> => {
    const state = freelanceStore();

    try {
        const response = await axios ({
            method: 'get',
            url: `${BASE_URL}/mypage/info`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data.data)
        // const data = response.data.data
        // state.updateState([...data])
        
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
                "name": information.name,
                "email": information.email,
                "password": information.password,
                "passwordCheck": information.passwordCheck,
                "businessRegistrationNumber": information.businessRegistrationNumber,
                "businessName": information.businessName,
                "phone": information.phone
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
            url: `${BASE_URL}/client/login`,
            data: {
                email: information.email,
                password: information.password,
            },
        });

        console.log(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message);
        } else {
            console.error("Unexpected error: ", error);
        }
    }
};