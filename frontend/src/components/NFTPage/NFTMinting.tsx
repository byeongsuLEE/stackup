import { useEffect, useRef, useState } from "react";
import { pinata, uploadMetadataToPinata } from "../../apis/NftApi";
import { generateImage, nftInfoProp } from "../../hooks/MakeImage";
import { handlePrint } from "../../hooks/MakePDF";
import { CallTest } from "../../hooks/Test";
import DoneButton from "../common/DoneButton";

// window.ethereum 타입 확장
declare global {
  interface Window {
    ethereum?: any; // 혹은 정확한 타입을 명시하고 싶다면 Web3Provider 타입을 사용할 수 있습니다.
  }
}

const NFTMinting = () => {
  //== pdf 생성 ==//
  const componentRef = useRef<HTMLDivElement>(null);

  const { Minting } = CallTest();
  const ethereum = window.ethereum;
  const [addr, setAddr] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  //== 데이터 임시 값 ==//
  const defaultNftInfo: nftInfoProp = {
    projectName: "Default Project",
    companyName: "Default Company",
    period: "2024.01.01 ~ 2024.12.31",
    name: "Default Name"
  };

  // 지갑 연결 함수
  const handleGetAccount = async () => {
    try {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      setAddr(account);
    } catch (error) {
      console.error("지갑 연결 오류:", error);
    }
  };

  // accountsChanged 이벤트 처리
  useEffect(() => {
    if (ethereum) {
      ethereum.on("accountsChanged", function (accounts: string[]) {
        setAddr(accounts[0]);
      });
    }
  }, [ethereum]);

  // 버튼 클릭 시 호출될 핸들러 함수
  const handleMintNFT = async () => {

    try {
      const image = await generateImage(canvasRef);
      const pdf = await handlePrint(componentRef);

      const imageHash = await pinata(image);
      const pdfHash = await pinata(pdf);

      const cid = await uploadMetadataToPinata(imageHash, pdfHash, defaultNftInfo);

      // NFT 발행
      await Minting(cid);
      alert("NFT 발행 호출");
    } catch (error) {
      console.error("NFT 발행 오류:", error);
      alert("NFT 발행 실패");
    }
  };

  return (
    <div>
      <div ref={componentRef}>
        {/* {ethereum && (
          <div onClick={handleGetAccount}>
            <DoneButton height={30} width={200} title="Connect Wallet" />
          </div>
        )}
        {ethereum && <p>Your Wallet address: {addr}</p>} */}

        {/* 캔버스 요소 추가 */}
        <canvas ref={canvasRef} style={{ border: "1px solid black", display: "none" }}></canvas>
      </div>
      <div className="mt-10 text-end"
        onClick={handleMintNFT}
      >
        <DoneButton height={30} width={150} title="제출" />
      </div>
    </div>
  );
};

export default NFTMinting;