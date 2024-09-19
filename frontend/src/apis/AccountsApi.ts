import axios from "axios"
import { accountBasic, accountDetailInfo, accountInfo, transactionInfo } from "./Account.type"

const BASE_URL: string = "http://localhost:8080/api/account"
const token: string = "수정"

//== 계좌 목록 조회 ==//
export const getAccount = async (): Promise<accountInfo[]> => {
    try {
        const response = await axios({
            method: "get",
            url: `${BASE_URL}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data)
        return response.data;

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }

        return [];
    }
}

//== 계좌 상세 조회 ==//
export const accountDetail  = async (accountId?: string): Promise<accountDetailInfo> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/${accountId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(response.data)
        return response.data;

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }

        return accountBasic;
    }
}

//== 계좌 거래내역 조회 ==//
export const accountTransaction = async (accountId?: string): Promise<transactionInfo[]> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/transactions/${accountId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        console.log(response.data)
        return response.data;

    } catch (error) {

        if (axios.isAxiosError(error)) {
            console.error("Axios error: ", error.message)

        } else {
            console.error("Unexpected error: ", error)
        }

        return [];
    }
}

//== 1원 송금 요청 ==//
export const authRequest = async (accountId: string): Promise<void> => {
    try {
        const response = await axios ({
            method: 'post',
            url: `${BASE_URL}/auth/${accountId}`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "accountNo": "수정 : 계좌번호",
                "authText": "수정 : 서비스 명"
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

//== 1원 송금 검증 ==//
export const authCheck = async (accountId: string): Promise<void> => {
    try {
        const response = await axios ({
            method:'post',
            url: `${BASE_URL}/${accountId}/checkCode`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                "account" : "수정: 계좌번호",
                "authCode" : "수정 : 인증코드"
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