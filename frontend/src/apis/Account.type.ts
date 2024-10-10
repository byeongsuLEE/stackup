//== 계좌 정보 ==//
export interface accountInfo {
    accountId?: string,
    accountName?: string,
    accountNum?: string,
    balnace?: string,
    bankCode?: string,
    createdDate?: string,
    expiryDate?: string
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
    transactionBalance: string,
    transactionAfterBalance: string,
    transactionSummary: string,
    transactionMemo: string,
    transactionAccountNo: string
}