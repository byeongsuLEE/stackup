import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contractProp } from "../../apis/Contract.type";
import { pinata, uploadMetadataToPinata } from "../../apis/NftApi";
import { generateImage } from "../../hooks/MakeImage";
import DoneButton from "../common/DoneButton";

// window.ethereum 타입 확장
declare global {
  interface Window {
    ethereum?: any; // 혹은 정확한 타입을 명시하고 싶다면 Web3Provider 타입을 사용할 수 있습니다.
  }
}

interface NFTMintingProps {
  Minting: (cid: string) => Promise<void>; // 부모 컴포넌트에서 전달받는 Minting 함수의 타입
  isLoading: boolean; // 부모 컴포넌트에서 전달받는 로딩 상태
  pdf: any;
  contractData: contractProp;
  projectId: number;
}

const NFTMinting = ({ Minting, isLoading, pdf, contractData, projectId }: NFTMintingProps) => {
  //== pdf 생성 ==//
  const componentRef = useRef<HTMLDivElement>(null);

  const ethereum = window.ethereum;
  const [, setAddr] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {

    if (ethereum) {
      ethereum.on("accountsChanged", function (accounts: string[]) {
        setAddr(accounts[0]);
      });
    }
    else {
      handleGetAccount();
    }
  }, [ethereum]);

  // 버튼 클릭 시 호출될 핸들러 함수
  const handleMintNFT = async () => {

    try {
      const image = await generateImage(canvasRef, contractData);

      const [imageHash, pdfHash] = await Promise.all([
        pinata(image),
        pinata(pdf)
      ]);

      const cid = await uploadMetadataToPinata(imageHash, pdfHash, contractData);

      // NFT 발행
      await Minting(cid);
      alert("NFT가 완성되었습니다.");
      navigate(`/project/detail/${projectId}`);
    } catch (error) {
      console.error("NFT 발행 오류:", error);
      alert("NFT 발행 실패");
    }
  };

  return (
    <>
      {isLoading ? (
        <div></div>
      ) : (
        <div>
          <div ref={componentRef}>
            {/* 캔버스 요소 추가 */}
            <canvas ref={canvasRef} style={{ border: "1px solid black", display: "none" }}></canvas>

            <div className="mt-2 text-end" onClick={handleMintNFT}>
              <DoneButton height={30} width={150} title="서명 제출" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NFTMinting;