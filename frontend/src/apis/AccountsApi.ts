import axios from "axios"
import { accountBasic, accountDetailInfo, accountInfo, transactionInfo } from "./Account.type"
import { freelanceMypage } from "./UserApi";
import { freelanceStore } from "../store/FreelanceStore";

const BASE_URL: string = "http://localhost:8080/api"

//== api 키 발급 ==//
export const getKey = async (): Promise<void> => {
    await freelanceMypage();
    console.log('안냥')
    const state = freelanceStore.getState();
    const response = await axios({
        method: 'post',
        url: `${BASE_URL}/account/key`,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        data: {
            userId: state.email
        }
    })
    console.log(response)
}

//== 계좌 목록 불러오기 ==//
export const accountUpdate = async (): Promise<void> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/account/update`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })

  console.log(response)
}

//== 계좌 목록 조회 ==//
export const getAccount = async (): Promise<accountInfo[]> => {
  const response = await axios({
    method: "get",
    url: `${BASE_URL}/account`,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })

  console.log(response)
  return response.data;
}

//== 계좌 상세 조회 ==//
export const accountDetail  = async (accountId?: string): Promise<accountDetailInfo> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/account/${accountId}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
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

//== 대표 계좌 설정 ==//
export const mainAccout = async (accountId? : string): Promise<void> => {
    const response = await axios({
        method: 'patch',
        url: `${BASE_URL}/account/${accountId}`,
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
    })

    console.log(response.data)
}

//== 계좌 거래내역 조회 ==//
export const accountTransaction = async (accountId?: string): Promise<transactionInfo[]> => {
    try {
        const response = await axios({
            method: 'get',
            url: `${BASE_URL}/account/transactions/${accountId}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
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
            url: `${BASE_URL}/account/auth/${accountId}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
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
            url: `${BASE_URL}/account/${accountId}/checkCode`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`
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