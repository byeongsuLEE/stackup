import axios from "axios";

const BASE_URL: string = "http://localhost:8080/api/board";

export const projectApply = async (boardId: string): Promise<void> => {
  try {
    const response = await axios({
      method: 'post',
      url: `${BASE_URL}/${boardId}/apply`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버에서 받은 응답이 있을 때
        console.error("Axios error response: ", error.response.data);
        console.error("Status code: ", error.response.status);
      } else {
        // 요청이 전송되었으나 서버로부터 응답을 받지 못했을 때
        console.error("Axios request error: ", error.message);
      }
    } else {
      // 예상치 못한 오류 처리
      console.error("Unexpected error: ", error);
    }

    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 다시 던짐
  }
};

// 지원한 게시글 목록 조회
export const appliedProject = async (): Promise<any> => {
  const response = await axios({
    method: 'get',
    url: `${BASE_URL}/apply-list`,
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`
    }
  })
  console.log(response.data)
  return response.data
}