import { addDays, differenceInDays, format } from 'date-fns';

interface WorkProps {
  title: string;
  startDate: Date;
  period: string;
  classification: string;
  deposit: string;
  deadline: Date;
  recruits: number;
  applicants: number;
  client: any;
}

const Work = ({ title, startDate, period, classification, deposit, deadline, recruits, applicants, client }: WorkProps) => {
  // const projectPeriod = startDate + ' ~ ' + format(addDays(startDate, parseInt(period, 10)), 'yyyy-MM-dd');
  // const budget = new Intl.NumberFormat().format(parseInt(deposit, 10));
  // const remainDay = differenceInDays(deadline, format(Date(), 'yyyy-MM-dd'));
  // startDate와 deadline을 Date 객체로 변환
  const validStartDate = startDate ? new Date(startDate) : null;
  const validDeadline = deadline ? new Date(deadline) : null;

  // period가 숫자인지 확인하고, 유효한 경우에만 사용
  const validPeriod = !isNaN(parseInt(period, 10)) ? parseInt(period, 10) : 0;

  // deposit이 숫자인지 확인하고, 유효한 경우에만 사용
  const validDeposit = !isNaN(parseInt(deposit, 10)) ? parseInt(deposit, 10) : 0;

  // projectPeriod 계산
  const projectPeriod = validStartDate
    ? `${format(validStartDate, 'yyyy-MM-dd')} ~ ${format(addDays(validStartDate, validPeriod), 'yyyy-MM-dd')}`
    : '유효하지 않은 시작일';  // 유효하지 않은 경우 표시할 내용

  // budget 계산
  const budget = new Intl.NumberFormat().format(validDeposit);

  // remainDay 계산
  const remainDay = validDeadline
    ? differenceInDays(validDeadline, new Date())
    : 0; // 유효하지 않은 경우 기본값 0

  // remainDay가 0 이하이면 출력하지 않기
  if (remainDay < 0) {
    return null;
  }

  if (classification === 'web') {
    classification = '웹'
  } else if (classification === 'mobile') {
    classification = '모바일'
  } else if (classification === 'publisher') {
    classification = '퍼블리셔'
  } else if (classification === 'ai') {
    classification = 'AI'
  } else {
    classification = 'DB'
  }

  if (applicants === null) {
    applicants = 0
  }

  //== remainDay가 0이하이면 출력X ==//
  if (remainDay < 0) {
    return null;
  }

  return (
    <div className="flex justify-center mt-10 ">

      <div className="flex px-10 justify-between items-center w-[1000px] h-[150px] bg-bgGreen border border-mainGreen rounded-lg">

        <div className="flex flex-col">
          <span className="font-bold text-xl">{title} _ {client.businessName}</span>
          <span className="text-subTxt text-sm mr-5">{projectPeriod} _ {budget}만원</span>
          <span className="font-bold text-subTxt">{classification}</span>
        </div>

        <div className="flex items-center">
          <div className="w-[2px] h-[120px] bg-mainGreen mr-10"></div>
          <div className="flex flex-col">
            <span className='text-red-400'>마감 {remainDay}일전</span>
            <span>지원자 {applicants}명/{recruits}명</span>
            <div className="flex mt-2 items-center justify-center bg-mainGreen rounded-lg w-[100px] h-[30px]">평점 {client.totalScore} 점</div>
          </div>
        </div>

      </div>
    </div>

  )
}
export default Work;