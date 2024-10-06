import axios from "axios"

const BASE_URL: string = "http://localhost:8080/api/project"

//== 계약서 정보 저장 ==//
export const submitContract = async (data: any, freelancerProjectId?: string): Promise<void> => {
  console.log(data)
    const response = await axios({
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
        "contractAdditionalTerms": data.condition
      }
    })
    console.log(response.data)
  }
  
  //== 계약서 정보 불러오기 ==//
  export const getContract = async (freelancerProjectId: string): Promise<void> => {
    const response = await axios({
      method: 'get',
      url: `${BASE_URL}/contract/${freelancerProjectId}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        freelancerProjectId : "1"
      }
    })
  
     console.log(response.data)
  }
  
  //== 서명 확인 ==//
  export const signature = async (sign?: string, projectId?: string): Promise<void> => {
    console.log(sign)
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/${projectId}/contract/sign`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        "message": "서명완료",
        "signature": sign
      }
    })

    console.log(response.data)
  }