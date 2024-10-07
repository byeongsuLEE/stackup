import { contractProp } from "../apis/Contract.type";

//== nft 생성 info ==//
export interface nftInfoProp {
  projectName: string,
  companyName: string,
  period: string,
  name: string
}

const getRandomPastelColor = (): string => {
  const r = Math.floor(Math.random() * 75 + 180);
  const g = Math.floor(Math.random() * 75 + 180);
  const b = Math.floor(Math.random() * 75 + 180);
  return `rgb(${r}, ${g}, ${b})`;
};

const getRandomGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // 랜덤 좌표 생성
  const x0 = Math.random() * width;
  const y0 = Math.random() * height;
  const x1 = Math.random() * width;
  const y1 = Math.random() * height;

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

  // 파스텔 톤의 랜덤 색상 두 개 생성
  const color1 = getRandomPastelColor();
  const color2 = getRandomPastelColor();

  // 랜덤한 색상 스톱 포인트 (0 ~ 1 사이의 값)
  const stop1 = Math.random();
  const stop2 = Math.random();

  // 그라디언트 색상과 스톱 값 설정
  gradient.addColorStop(Math.min(stop1, stop2), color1);
  gradient.addColorStop(Math.max(stop1, stop2), color2);

  return gradient;
};

//== 데이터 임시 값 ==//
export const defaultNftInfo: nftInfoProp = {
  projectName: "Default Project",
  companyName: "Default Company",
  period: "2024.01.01 ~ 2024.12.31",
  name: "Default Name"
};

// 캔버스에서 이미지를 생성하고 FormData로 반환하는 함수
export const generateImage = async (canvasRef: React.RefObject<HTMLCanvasElement>, data: contractProp): Promise<FormData> => {
  const canvas = canvasRef.current;

  const start = data?.contractStartDate?.split('T')[0];
  const end = data?.contractEndDate?.split('T')[0];

  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = 300;
      canvas.height = 200;

      const gradient = getRandomGradient(ctx, canvas.width, canvas.height);

      // 캔버스 초기화
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 배경 설정
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 텍스트 색상
      ctx.fillStyle = "#000000";

      // 텍스트 추가
      ctx.font = "bold 30px Arial";
      ctx.fillText(data.projectName, 20, 50);

      ctx.font = "23px Arial";
      ctx.fillText(data.contractCompanyName, 20, 90);

      ctx.font = "15px Arial";
      ctx.fillText(`${start} - ${end}`, 20, 130);

      ctx.font = "20px Arial";
      ctx.fillText(data.candidateName, 20, 170);

      return new Promise<FormData>((resolve) => {
        canvas.toBlob((blob) => {
          const formData = new FormData();
          if (blob) {
            formData.append("file", blob, "nftImage.png");
          }
          resolve(formData);
        }, "image/png");
      });
    }
  }
  
  return new FormData();
};
