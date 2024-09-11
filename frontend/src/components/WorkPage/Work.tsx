import { format, addDays, differenceInDays } from 'date-fns';

interface WorkProps {
  title: string;
  company: string;
  startDate: Date;
  period: string;
  classification: string;
  deposit: string;
  deadline: Date;
  recruits: number;
  applicants: number;
  rate: number;

}

const Work = ({ title, company, startDate, period, classification, deposit, deadline, recruits, rate, applicants }: WorkProps) => {
  const projectPeriod = startDate + ' ~ ' + format(addDays(startDate, parseInt(period, 10)), 'yyyy-MM-dd');
  const budget = new Intl.NumberFormat().format(parseInt(deposit, 10));
  const remainDay = differenceInDays(deadline, format(Date(), 'yyyy-MM-dd'));

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

  return (
    <div className="flex justify-center mt-10 ">

      <div className="flex px-10 justify-between items-center w-[1000px] h-[150px] bg-bgGreen border border-mainGreen rounded-lg">

        <div className="flex flex-col">
          <span className="font-bold text-xl">{title} _ {company}</span>
          <span className="text-subTxt text-sm mr-5">{projectPeriod} _ {budget}만원</span>
          <span className="font-bold text-subTxt">{classification}</span>
        </div>

        <div className="flex items-center">
          <div className="w-[2px] h-[120px] bg-mainGreen mr-10"></div>
          <div className="flex flex-col">
            <span>마감 {remainDay}일전</span>
            <span>지원자 {applicants}명/{recruits}명</span>
            <div className="flex mt-2 items-center justify-center bg-mainGreen rounded-lg w-[100px] h-[30px]">평점 {rate}</div>
          </div>
        </div>

      </div>
    </div>

  )
}
export default Work;