import axios from "axios"
import { accountInfo, transactionInfo } from "./Account.type"
import { passwordStore } from "../store/AccountStore"

const BASE_URL: string = "http://localhost:8080/api"

//== 계좌 목록 불러오기 ==//
export const accountUpdate = async (): Promise<void> => {
  await axios({
    method: 'get',
    url: `${BASE_URL}/account/update`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
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

  const accountList = response.data

  accountList.forEach((account: accountInfo) => {
    const balance = account.balnace

    if (balance != undefined){
      account.balnace = balance.toLocaleString();
    }
  })

  return accountList;
}

//== 계좌 상세 조회 ==//
export const accountDetail  = async (accountId?: string): Promise<accountInfo> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/account/${accountId}`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })

  const account = response.data;
  if (account.balnace != undefined) {
    account.balnace = account.balnace.toLocaleString(); 
  }

  return account;
}

//== 대표 계좌 설정 ==//
export const mainAccout = async (accountId? : string): Promise<string> => {
  const response = await axios({
    method: 'post',
    url: `${BASE_URL}/account/main/${accountId}`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })

  return response.data
}

//== 대표 계좌 조회 ==//
export const getMainAccount = async (): Promise<string> => {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/account/main`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })

    return response.data
}

//== 계좌 거래내역 조회 ==//
export const accountTransaction = async (accountId?: string): Promise<transactionInfo[]> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/account/transactions/${accountId}`,
    headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })

  const transactionList = response.data

  transactionList.forEach((transaction: transactionInfo) => {
    transaction.transactionBalance = Number(transaction.transactionBalance).toLocaleString();
    transaction.transactionAfterBalance = Number(transaction.transactionAfterBalance).toLocaleString();
    transaction.transactionDate = `${transaction.transactionDate.slice(0, 4)}.${transaction.transactionDate.slice(4, 6)}.${transaction.transactionDate.slice(6, 8)}`;
    transaction.transactionTime = `${transaction.transactionTime.slice(0, 2)}:${transaction.transactionTime.slice(2, 4)}:${transaction.transactionTime.slice(4, 6)}`;
  })
  
  return transactionList;
}

//== 간편 비밀번호 설정 ==//
export const setPassword = async (): Promise<void> => {
  const { password, confirmPassword } = passwordStore.getState();

  if (password === confirmPassword) {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/account/password`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data : {
        'secondPassword' : password
      }
    })

    console.log(response.data)
  } else {
    alert('비밀번호가 다릅니다.')
  }
}

//== 간편 비밀번호 유무 ==//
export const checkPassword = async (): Promise<void> => {
  const { setCheckoutPassword } = passwordStore.getState();

  await axios ({
    method: 'get',
    url: `${BASE_URL}/account/password/check`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
  setCheckoutPassword(true)
}

//== 간편 비밀번호 확인 ==//
export const confirmPassword = async (password: string) : Promise<void> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/account/password`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data : {
        'secondPassword' : password
      }
  })
  console.log(response.data)
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

//== 계좌 이체 ==//
export const transfer = async (accountId: string, accountNum: string, balance: string): Promise<void> => {
  const response = await axios ({
    method: 'post',
    url: `${BASE_URL}/account/${accountId}/transfer`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    },
    data: {
      'depositAccount': accountNum,
      'transactionBalance': balance
    }
  })

  console.log(response)
}