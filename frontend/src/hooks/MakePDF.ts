import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

/**
 * DOM 요소를 PDF로 변환하고 FormData 객체로 반환하는 함수
 * @param elementRef - PDF로 변환할 DOM 요소의 참조값
 * @returns PDF 파일이 포함된 FormData 객체를 반환하는 Promise
 */
export const handlePrint = async (elementRef: React.RefObject<HTMLDivElement>): Promise<FormData> => {
  const element = elementRef.current;
  const formData = new FormData();

  try {
    if (!element) {
      console.error("DOM 요소가 존재하지 않습니다.");
      return formData;
    }

    // 요소 크기 조정
    const originalWidth = element.style.width;
    const originalHeight = element.style.height;

    element.style.width = `${element.scrollWidth}px`;
    element.style.height = `${element.scrollHeight}px`;

    // DOM 요소를 PNG로 변환
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1, // 이미지 품질을 최대로 설정
      width: element.scrollWidth, // 전체 너비 캡처
      height: element.scrollHeight // 전체 높이 캡처
    });

    // 원래 크기로 되돌리기
    element.style.width = originalWidth;
    element.style.height = originalHeight;

    if (!dataUrl) {
      console.error("PNG 생성 중 문제가 발생했습니다.");
      return formData;
    }

    // PDF 페이지 크기 설정 (A4 크기)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth(); // A4 너비 (210mm)
    const pageHeight = pdf.internal.pageSize.getHeight(); // A4 높이 (297mm)

    // 이미지 크기 조정 (비율 유지)
    const imgRatio = element.scrollWidth / element.scrollHeight;
    const pageRatio = pageWidth / pageHeight;

    let imgWidth: number;
    let imgHeight: number;

    // A4 페이지에 맞게 이미지의 비율을 유지하면서 조정
    if (imgRatio > pageRatio) {
      // 이미지가 더 넓은 경우 A4 너비에 맞추고 높이를 조정
      imgWidth = pageWidth;
      imgHeight = pageWidth / imgRatio;
    } else {
      // 이미지가 더 높은 경우 A4 높이에 맞추고 너비를 조정
      imgHeight = pageHeight;
      imgWidth = pageHeight * imgRatio;
    }

    // A4 페이지 크기에 맞추어 이미지를 추가 (중앙 정렬)
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = (pageHeight - imgHeight) / 2;
    pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

    // Blob 생성 후 FormData에 추가
    const pdfBlob: Blob = pdf.output('blob');
    formData.append('file', pdfBlob, 'document.pdf');

  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
  }

  return formData;
};
