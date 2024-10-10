import axios from "axios"

const svURL = import.meta.env.VITE_SERVER_URL;
const BASE_URL = `${svURL}/user/project`

//== 계약서 정보 저장 ==//
export const submitContract = async (data: any, freelancerProjectId?: string): Promise<void> => {
    await axios({
      method: 'patch',
      url: `${BASE_URL}/contract/submit`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        "freelancerProjectId" : freelancerProjectId,
        "contractStartDate": data.startDate,
        "contractEndDate": data.endDate,
        "contractTotalAmount": data.deposit,
        "contractDownPayment": data.startPayment,
        "contractFinalPayment": data.finalPayment,
        "contractCompanyName": data.clientName,
        "contractConfidentialityClause": "All parties agree to confidentiality.",
        "contractAdditionalTerms": data.condition,
        "candidateName": data.candidateName,
        "period" : data.period,
        "projectName": data.projectName
      }
    })
  }
  
  //== 계약서 정보 불러오기 ==//
  export const getContract = async (freelancerProjectId: string): Promise<void> => {
    await axios({
      method: 'get',
      url: `${BASE_URL}/contract/${freelancerProjectId}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        freelancerProjectId : freelancerProjectId
      }
    })
  }

  //== 서명 확인 ==//
  export const signature = async (sign?: string, freelancerProjectId?: string): Promise<void> => {
    await axios({
      method: 'post',
      url: `${BASE_URL}/${freelancerProjectId}/contract/sign`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        "signature": sign
      }
    })
  }

  //== 계약서 정보 ==//
export const contractData = async (freelancerProjectId?: string): Promise<any> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/contract/${freelancerProjectId}`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
  return response.data.data
}