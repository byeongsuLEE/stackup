import { ethers } from 'ethers';

// NFT 스마트 컨트랙트 주소
const NFT_CONTRACT_ADDRESS = '0x066b74Fc73bfaf0C266b0269F91dDeeB5aAB6998';
const metadataURI = "ipfs://Qmbp8Ugq5gabMBQ7QAP18TPPF9FAENDsy34pM2RiuUzNKR";

// NFT ABI 정의
const NFT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" }
    ],
    name: "mintNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  }
];

// NFT 발행 함수
export const callNft = () => {
  const mintNFT = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) throw new Error("MetaMask가 설치되어 있지 않습니다.");

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
      const address = await signer.getAddress();

      // NFT 발행 (mintNFT 함수 호출)
      const tx = await nftContract.mintNFT(address, metadataURI, {
        gasLimit: 500000, // 가스 한도 설정
      });
      console.log("트랜잭션 전송:", tx.hash);

      // 트랜잭션 완료 대기
      await tx.wait();
      console.log("NFT 발행 성공:", tx);
    } catch (error) {
      if (error instanceof Error) {
        console.error("NFT 발행 오류:", error.message);
        if ('code' in error) {
          console.error("오류 코드:", error.code);
        }
        if ('data' in error) {
          console.error("오류 데이터:", error.data);
        }
      }
    }
  };

  return { mintNFT };
};
