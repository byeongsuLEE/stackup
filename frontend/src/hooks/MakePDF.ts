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

    // DOM 요소를 PNG로 변환
    const dataUrl = await domtoimage.toPng(element);

    if (!dataUrl) {
      console.error("PNG 생성 중 문제가 발생했습니다.");
      return formData;
    }

    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const scale = Math.min(pageWidth / elementWidth, pageHeight / elementHeight);
    const imgWidth = elementWidth * scale;
    const imgHeight = elementHeight * scale;

    // PDF에 이미지 추가
    pdf.addImage(dataUrl, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);

    // Blob 생성 후 FormData에 추가
    const pdfBlob: Blob = pdf.output('blob');
    formData.append('file', pdfBlob, 'document.pdf');

  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
  }

  return formData;
};