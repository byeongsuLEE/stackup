import { useEffect, useState } from "react";
import { callNft } from "../../hooks/MintNft";
import { useWeb3 } from "../../hooks/UseWeb3";

const Wallet = () => {
  const { mintNFT } = callNft();
  const { account, ssfBalance } = useWeb3();
  const [isLogin, setIsLogin] = useState<boolean>();

  useEffect(() => {
    if (account === null) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [account]);

  // 버튼 클릭 시 호출될 핸들러 함수
  const handleMintNFT = async () => {
    try {
      // NFT 발행
      await mintNFT()
      alert("NFT 발행 호출");
    } catch (error) {
      console.error("NFT 발행 오류:", error);
      alert("NFT 발행에 실패했습니다.");
    }
  };

  return (
    <>
      {isLogin ? (
        <div className="bg-bgGreen w-auto h-[120px] flex flex-col border border-mainGreen rounded-lg p-5">
          <span className="font-bold text-subGreen1 mb-2">나의 지갑 정보</span>
          <span>계정 : {account}</span>
          <span>잔액 : {ssfBalance} SSF</span>
          <button onClick={handleMintNFT}>nft</button>
        </div>
      ) : (
        <div className="text-center mb-5">
          <span className="mr-1">
            NFT경력관리를 위한 지갑을 사용을 위해
          </span>
          <a className=" text-blue-500 underline" href="https://metamask.io/ko/">
            MetaMask
          </a>
          <span>
            를 설치해주세요.
          </span>
        </div>
      )}
    </>
  )
}
export default Wallet;