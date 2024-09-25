// import { ethers } from 'ethers';
// // import MyNFT from '../../../blockchain/NFT/build/contracts/MyNFT.json'; // JSON 파일 임포트

// // NFT 스마트 컨트랙트 주소
// const NFT_CONTRACT_ADDRESS = '0x066b74Fc73bfaf0C266b0269F91dDeeB5aAB6998';
// const metadataURI = "https://ipfs.io/ipfs/Qmbp8Ugq5gabMBQ7QAP18TPPF9FAENDsy34pM2RiuUzNKR";
// // NFT ABI 정의
// const NFT_ABI = [
//     {
//       inputs: [
//         { internalType: "address", name: "to", type: "address" },
//         { internalType: "string", name: "tokenURI", type: "string" }
//       ],
//       name: "mint",
//       outputs: [],
//       stateMutability: "nonpayable",
//       type: "function",
//     }
//   ];

// export const CallTest = () => {

//   const Minting = async () => {
//     try {
//       const { ethereum } = window;
//       if (!ethereum) throw new Error("MetaMask가 설치되어 있지 않습니다.");

//       const provider = new ethers.BrowserProvider(ethereum);
//       const signer = await provider.getSigner();

//       const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
//       const address = await signer.getAddress();

//       // NFT 발행 (mintNFT 함수 호출)
//       const tx = await nftContract.mint(address, metadataURI, {
//         gasLimit: 1000000
//       });
//       console.log("트랜잭션 전송:", tx.hash);

//       // 트랜잭션 완료 대기
//       await tx.wait();
//       console.log("NFT 발행 성공:", tx);
//     } catch (error) {
//       if (error instanceof Error) {
//         console.error("NFT 발행 오류:", error.message);
//         if ('code' in error) {
//           console.error("오류 코드:", error.code);
//         }
//         if ('data' in error) {
//           console.error("오류 데이터:", error.data);
//         }
//       }
//     }
//   };
//   return { Minting }
// }

import { ethers } from 'ethers';
import MyNFT from '../../../blockchain/NFT/build/contracts/MyNFT.json'; // JSON 파일 임포트

// NFT 스마트 계약 주소
const NFT_CONTRACT_ADDRESS = '0xcB892B05AE99DEB27A380C129191719477628F1C';
const cid = 'Qmbp8Ugq5gabMBQ7QAP18TPPF9FAENDsy34pM2RiuUzNKR'; // Pinata에서 받은 CID
const metadataURI = `ipfs://${cid}`; // IPFS CID를 URI로 사용

// NFT ABI 정의
const NFT_ABI = MyNFT.abi;

export const CallTest = () => {

  const Minting = async () => {
    try {
      // MetaMask의 window.ethereum 객체가 존재하는지 확인
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask가 설치되어 있지 않습니다.");
      }

      // ethers.js v6: BrowserProvider 사용
      const provider = new ethers.BrowserProvider(window.ethereum);

      // ethers.js v5: Web3Provider 사용
      // const provider = new ethers.providers.Web3Provider(window.ethereum as any);

      const signer = await provider.getSigner(); // 사용자의 서명 계정 가져오기

      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

      // 민팅 트랜잭션 발생 (IPFS 메타데이터 URI를 함께 전달)
      const tx = await nftContract.mint(await signer.getAddress(), metadataURI, {
        gasLimit: 1000000
      });

      console.log(tx)
      console.log("트랜잭션 전송:", tx.hash);

      // 트랜잭션 완료 대기
      const receipt = await tx.wait();
      console.log("NFT 발행 성공:", receipt);

    } catch (error) {
      console.error("NFT 발행 오류:", error);
    }
  };

  return { Minting };
};
