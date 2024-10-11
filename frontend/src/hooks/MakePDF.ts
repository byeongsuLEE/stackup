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

    // PDF 페이지 크기 설정 (A4 크기로 설정하고 모든 내용을 맞추기 위해 이미지 비율 유지)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format:  'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 이미지 크기 조정 (모든 내용을 A4 한 페이지에 맞추기)
    const imgWidth = pageWidth;
    const imgHeight = (element.scrollHeight / element.scrollWidth) * pageWidth;

    // A4 페이지 크기에 맞추어 이미지를 한 페이지에 추가
    pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight > pageHeight ? pageHeight : imgHeight);

    // Blob 생성 후 FormData에 추가
    const pdfBlob: Blob = pdf.output('blob');
    formData.append('file', pdfBlob, 'document.pdf');

  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
  }

  return formData;
};
