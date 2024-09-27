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
  const gradient = ctx.createLinearGradient(0, 0, width, height);

  // 파스텔 톤의 랜덤 색상 하나 생성
  const color1 = getRandomPastelColor();
  const color2 = getRandomPastelColor();

  // 그라디언트 색상 설정
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

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
export const generateImage = async (canvasRef: React.RefObject<HTMLCanvasElement>): Promise<FormData> => {
  const canvas = canvasRef.current;

  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      canvas.width = 200;
      canvas.height = 300;

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
      ctx.fillText("UACV", 20, 80);

      ctx.font = "23px Arial";
      ctx.fillText("정채준", 20, 130);

      ctx.font = "15px Arial";
      ctx.fillText("2024.08.01 ~ 2024.08.31", 20, 170);

      ctx.font = "20px Arial";
      ctx.fillText("송준혁이다", 20, 210);

      // 이미지를 Blob 데이터로 변환하고 FormData로 반환
      return new Promise<FormData>((resolve) => {
        canvas.toBlob((blob) => {
          const formData = new FormData();
          if (blob) {
            // Blob 데이터를 FormData로 추가
            formData.append("file", blob, "nftImage.png");
          }
          resolve(formData); // Blob이 없더라도 빈 FormData 반환
        }, "image/png");  // 이미지 형식 설정 (여기선 png로 설정)
      });
    }
  }
  
  return new FormData(); // 캔버스가 없을 경우에도 빈 FormData 반환
};
