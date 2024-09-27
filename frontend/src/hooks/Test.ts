
import { ethers } from 'ethers';
import MyNFT from '../../../blockchain/NFT/build/contracts/MyNFT.json'; // JSON 파일 임포트

// NFT 스마트 계약 주소
// const NFT_CONTRACT_ADDRESS = '0x91e4dd5c17671815aB13F0b8fE8903eDe02a96B9';
// const cid = 'Qmbp8Ugq5gabMBQ7QAP18TPPF9FAENDsy34pM2RiuUzNKR'; // Pinata에서 받은 CID
// const metadataURI = `ipfs://${cid}`; // IPFS CID를 URI로 사용

// NFT ABI 정의
const NFT_ABI = MyNFT.abi;

export const CallTest = () => {


  const Minting = async (
    // cid: string
  ) => {

    // NFT 스마트 계약 주소
    const cid = "Qmbp8Ugq5gabMBQ7QAP18TPPF9FAENDsy34pM2RiuUzNKR"
    const NFT_CONTRACT_ADDRESS = '0x1781e6F689483d52F346b6dCbfD4732298Eb1AC9';
    const metadataURI = `https://fuchsia-changing-flamingo-499.mypinata.cloud/ipfs/${cid}`; // IPFS CID를 URI로 사용

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
      // const web3 = new Web3(/* 프로바이더 설정 */);
      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
      // const token = new web3.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS);

      // 민팅 트랜잭션 발생 (IPFS 메타데이터 URI를 함께 전달)
      const tx = await nftContract.mint(await signer.getAddress(), metadataURI, {
        gas: 0,
        // data: token.methods.approve("", 10).encodeABI(), 
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
