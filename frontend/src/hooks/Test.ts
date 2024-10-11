
import { ethers } from 'ethers';
import MyNFT from '../../../blockchain/NFT/build/contracts/MyNFT.json'; // JSON 파일 임포트
import { useState } from 'react';

// NFT ABI 정의
const NFT_ABI = MyNFT.abi;

export const CallTest = () => {
  
  const [isLoading, setIsLoading] = useState(false);

  const Minting = async ( cid: string ) => {
    console.log(cid)
    // NFT 스마트 계약 주소
    const NFT_CONTRACT_ADDRESS = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
    const metadataURI = `https://ipfs.io/ipfs/${cid}`; // IPFS CID를 URI로 사용

    try {
      setIsLoading(true); // 로딩 상태 시작

      // MetaMask의 window.ethereum 객체가 존재하는지 확인
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask가 설치되어 있지 않습니다.");
      }

      // ethers.js v6: BrowserProvider 사용
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); // 사용자의 서명 계정 가져오기
      
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

      // 민팅 트랜잭션 발생 (IPFS 메타데이터 URI를 함께 전달)
      const tx = await nftContract.mint(await signer.getAddress(), metadataURI, {
        gas: 0,
        // data: token.methods.approve("", 10).encodeABI(), 
      });

      console.log(tx)
      console.log("트랜잭션 전송:", tx.hash);
      const receipt = await tx.wait();

      setIsLoading(false);
      console.log("NFT 발행 성공:", receipt);

    } catch (error) {
      console.error("NFT 발행 오류:", error);
    }
  };

  return { Minting, isLoading };
};
