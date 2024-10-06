import { ethers } from 'ethers';

export const MakeSign = () => {
  const signMessage = async () => {
    try {
      // MetaMask의 window.ethereum 객체가 존재하는지 확인
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask가 설치되어 있지 않습니다.');
      }

      // ethers.js v6: BrowserProvider 사용
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner(); // 사용자의 서명 계정 가져오기

      // 지갑 주소 가져오기
      const address = await signer.getAddress();
      console.log('지갑 주소:', address);

      // 사용자가 서명할 메시지 설정
      const message = "서명을 하려면 계속 진행해주세요.";

      // 메시지 서명 요청
      const signedMessage = await signer.signMessage(message);

      return { address, signedMessage }; // 지갑 주소와 서명된 메시지 반환
    } catch (error) {
      console.error('메시지 서명 오류:', error);
    }
  };

  return { signMessage };
};
