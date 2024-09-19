//== 계좌 정보 ==//
export interface accountInfo {
    accountId: string,
    bank: string,
    accountNo: string,
    balance: number,
    bankCode: string
}

//== 계좌 상세 정보 ==//
export interface accountDetailInfo {
    bankCode?: string,
    accountNo?: string,
    balance?: number,
    bank?: string
}

//== 계좌 기본 정보 ==//
export const accountBasic = {
    bankCode: "",
    accountNo: "",
    balance: 0,
    bank: ""
}

export interface transactionInfo {
    transactionUniqueNo: string,
    transactionDate: string,
    transactionTime: string,
    transactionType: string,
    transactionTypeName: string,
    transactionBalance: number,
    transcationAfterBalance: string,
    transcationSummary: string
}