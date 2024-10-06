import axios from "axios"

const BASE_URL: string = "http://localhost:8080/api/project"

//== 계약서 정보 저장 ==//
export const submitContract = async (): Promise<void> => {
    const response = await axios({
      method: 'patch',
      url: `${BASE_URL}/contract/submit`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        "freelancerProjectId" : 1,
        "contractStartDate": "2024-10-05",
        "contractEndDate": "2025-01-01",
        "contractTotalAmount": 5000000,
        "contractDownPayment": 1000000,
        "contractFinalPayment": 4000000,
        "contractCompanyName": "ABC Corp",
        "contractConfidentialityClause": "All parties agree to confidentiality.",
        "contractAdditionalTerms": "Freelancer must provide weekly reports."
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
  export const signature = async (projectId: string): Promise<void> => {
    const response = await axios({
      method: 'patch',
      url: `${BASE_URL}/${projectId}/contract/sign`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        "message": "서명하고 싶은 메시지",
        "signature": "지갑에서 가져온 서명 값"
      }
    })

    console.log(response.data)
  }