import axios, { AxiosResponse } from 'axios';

interface nftInfo {
    projectName: string,
    companyName: string,
    period: string,
    name: string
}

export const makeNFT = async (data: nftInfo): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            return reject(new Error('Canvas context 생성 실패'));
        }

        canvas.width = 200;
        canvas.height = 300;

        //== 배경 ==//
        context.fillStyle = '#000000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //== 입력 값으로 text 바꿀수 있게 수정하기 ==//
        context.fillStyle = '#ffffff';
        context.font = '30px Arial';
        context.fillText(data.projectName, 30, 80);

        context.fillStyle = '#ffffff';
        context.font = '20px Arial';
        context.fillText(data.companyName, 30, 110);

        context.fillStyle = '#ffffff';
        context.font = '10px Arial';
        context.fillText(data.period, 30, 130);

        context.fillStyle = '#ffffff';
        context.font = '20px Arial';
        context.fillText(data.name, 30, 160);

        //== Blob으로 변환 ==//
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Blob 생성 실패'));
            }
        }, 'image/png')
    })    
}

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
