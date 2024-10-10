import axios, { AxiosResponse } from 'axios';
import { contractProp } from './Contract.type';

// FormData를 Pinata에 업로드하는 함수
export const pinata = async (formData: FormData): Promise<string> => {

  try {
    const response: AxiosResponse = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      headers: {
        'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
        'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_API_KEY,
      },
      data: formData,
    });

    return response.data.IpfsHash; // 성공 시 IPFS 해시 반환
    
  } catch (error) {
    console.error('업로드 중 오류가 발생했습니다:', error);
    return ''; // 오류 발생 시 빈 문자열 반환
  }
};

// 이미지 CID를 사용하여 JSON 메타데이터 생성 및 Pinata에 업로드
export const uploadMetadataToPinata = async (imageCID: string, pdfCID: string, data: contractProp): Promise<string> => {
  const start = data?.contractStartDate?.split('T')[0];
  const end = data?.contractEndDate?.split('T')[0];

  const metadata = {
    name: data.projectName,
    description: `${start}일 부터 ${end}일 까지 ${data.period}일 동안 진행한 프로젝트`,
    image: `https://ipfs.io/ipfs/${imageCID}`,
    attributes: [
      {
        trait_type: "Document",
        value: `https://ipfs.io/ipfs/${pdfCID}`,
      }
    ]
  };

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      headers: {
        'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
        'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_API_KEY,
      },
      data: metadata,
    });

    console.log(response)
    
    const jsonHash = response.data.IpfsHash;
    return jsonHash; // 성공 시 해시값 반환
  } catch (error) {
    console.error('Pinata에 메타데이터 업로드 중 오류가 발생했습니다:', error);
    return ''; // 실패 시 null 반환
  }
};
