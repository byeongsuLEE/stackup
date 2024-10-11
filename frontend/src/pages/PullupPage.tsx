import React, { useEffect } from 'react';
const svURL = import.meta.env.VITE_SERVER_URL;
declare global {
  interface Window {
    IMP: any;
  }
}

interface PaymentProps {
  boardId: string;
}

const Payment: React.FC<PaymentProps> = ({ boardId }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://cdn.iamport.kr/js/iamport.payment-1.2.0.js`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const requestPay = () => {
    const { IMP } = window;
    IMP.init('imp26004453'); // 가맹점 식별코드 (본인의 가맹점 식별코드로 변경해야 함)
    const merchantUid = generateMerchantUid();

    IMP.request_pay(
      {
        pg: 'kakaopay',
        pay_method: 'card',
        merchant_uid: merchantUid, // 주문번호
        name: 'STACKUP',
        amount: 50000, // 결제 금액
      },
      function (rsp: any) {
        if (rsp.success) {
          // 결제 성공 시 Spring Boot 서버로 요청
          fetch(`${svURL}/board/${boardId}/payment-success`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              impUid: rsp.imp_uid,
              paidAmount: rsp.paid_amount,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (rsp.paid_amount === data.response.amount) {
                alert('결제 성공');
              } else {
                alert('결제 실패');
              }
            });
        } else {
          // 결제 실패 시
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );
  };

  return <button className="bg-subGreen1 text-bgGreen font-bold text-sm px-3 rounded-lg ml-2" onClick={requestPay}>끌올하기</button>;
};

export default Payment;


const generateMerchantUid = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // YYYYMMDD-HHMMSS 형식으로 주문번호 생성
  return `ORD${year}${month}${date}-${hours}${minutes}${seconds}`;
};