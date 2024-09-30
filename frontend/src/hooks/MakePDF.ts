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

    const dataUrl = await domtoimage.toPng(element);

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

    // PDF에 이미지를 추가 (중앙 정렬)
    pdf.addImage(dataUrl, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);

    const pdfBlob: Blob = pdf.output('blob');

    formData.append('file', pdfBlob, 'document.pdf');

  } catch (error) {
    console.error("PDF 생성 중 오류 발생:", error);
  }

  return formData;
};
