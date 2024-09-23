import axios, { AxiosResponse } from 'axios';

export const pinata = async (formData: FormData): Promise<string> => {
    try {
        const response: AxiosResponse = await axios({
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
            headers: {
                // 'pinata_api_key': process.env.REACT_APP_PINATA_API_KEY || '',
                // 'pinata_secret_api_key': process.env.REACT_APP_PINATA_SECRET_API_KEY || '',
                'pinata_api_key': '',
                'pinata_secret_api_key': '',
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        });

        return response.data.IpfsHash;
    } catch (error) {
        console.error('업로드 중 오류가 발생했습니다:', error);
        throw new Error('파일 업로드 실패');
    }
};
