import { useRef, useState } from "react";
import DoneButton from "../components/common/DoneButton";
import { CallTest } from "../hooks/Test";
import { generateImage, nftInfoProp } from "../hooks/MakeImage";
import { pinata, uploadMetadataToPinata } from "../apis/NftApi";

//== pdf 생성 ==//
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

const Test = () => {

  //== pdf 생성 ==//
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = async (): Promise<FormData> => {
    const element = componentRef.current;
    
    const formData = new FormData(); // 기본적으로 빈 FormData 생성
  
    try {
      if (!element) {
        console.error("DOM 요소가 존재하지 않습니다.");
        return formData; // 요소가 없는 경우 빈 FormData 반환
      }
  
      // DOM 요소를 PNG 이미지로 변환
      const dataUrl = await domtoimage.toPng(element);
  
      // 요소의 크기를 가져옴
      const elementWidth = element.offsetWidth;
      const elementHeight = element.offsetHeight;
  
      // PDF 페이지 크기를 A4로 설정 (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
  
      // A4 크기의 비율에 맞추기 위해 이미지 크기를 조정
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
  
      // 비율을 계산하여 이미지를 PDF에 맞춤
      const scale = Math.min(pageWidth / elementWidth, pageHeight / elementHeight);
      const imgWidth = elementWidth * scale;
      const imgHeight = elementHeight * scale;
  
      // PDF에 이미지를 추가 (가운데 배치)
      pdf.addImage(dataUrl, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
  
      // PDF를 Blob으로 변환
      const pdfBlob: Blob = pdf.output('blob');
  
      // Blob을 FormData에 추가
      formData.append('file', pdfBlob, 'document.pdf'); // 파일 이름과 함께 Blob 추가
  
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
    }
  
    // 항상 FormData를 반환 (오류 발생 시에도 빈 FormData 반환)
    return formData;
  };
  
  
 
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

  const handleGetAcount = async e => {
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    setAddr(account);
  };

  if (ethereum) {
    ethereum.on("accountsChanged", function (accounts) {
      setAddr(accounts[0]);
    });
  }

  // 버튼 클릭 시 호출될 핸들러 함수
  const handleMintNFT = async () => {
    
    const image = await generateImage(canvasRef);
    const pdf = await handlePrint();

    const imageHash = await pinata(image);
    const pdfHash = await pinata(pdf);

    const cid = await uploadMetadataToPinata(imageHash, pdfHash, defaultNftInfo);

    try {
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
      {ethereum && (
        <div onClick={handleGetAcount}>
          <DoneButton height={30} width={200} title="Connect Wallet" />
        </div>
      )}
      {ethereum && <p>Your Wallet address: {addr}</p>}

      {/* 캔버스 요소 추가 */}
      <canvas ref={canvasRef} style={{ border: "1px solid black" }}></canvas>

      <div onClick={handleMintNFT}>
        <DoneButton height={30} width={200} title="Contract 배포" />
        </div>
        <button onClick={handlePrint}>Download PDF</button>
      </div>
    </div>
  );
};

export default Test;
