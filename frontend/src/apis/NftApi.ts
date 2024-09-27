import axios, { AxiosResponse } from 'axios';
import { nftInfoProp } from '../hooks/MakeImage';

// FormData를 Pinata에 업로드하는 함수
export const pinata = async (formData: FormData): Promise<string> => {
  try {
    const response: AxiosResponse = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
      headers: {
        // 'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY || '',
        // 'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY || '',
        'pinata_api_key': '',
        'pinata_secret_api_key': ''
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
export const uploadMetadataToPinata = async (imageCID: string, data: nftInfoProp): Promise<string> => {
  const metadata = {
    name: "My NFT",
    description: "This NFT was generated from user input",
    image: `https://gateway.pinata.cloud/ipfs/${imageCID}`, // 이미지 CID를 참조
    attributes: [
      {
        trait_type: "projectName",
        value: data.projectName,
      },
      {
        trait_type: "companyName",
        value: data.companyName,
      },
      {
        trait_type: "period",
        value: data.period,
      },
      {
        trait_type: "name",
        value: data.name,
      },
    ],
  };

  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      headers: {
        // 'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY || '',
        // 'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY || '',
        'pinata_api_key': '',
        'pinata_secret_api_key': ''
      },
      data: metadata,
    });

    const jsonHash = response.data.IpfsHash;
    return jsonHash; // 성공 시 해시값 반환
  } catch (error) {
    console.error('Pinata에 메타데이터 업로드 중 오류가 발생했습니다:', error);
    return ''; // 실패 시 null 반환
  }
};
