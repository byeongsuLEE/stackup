interface WorkProps {
  title: string;
  company: string;
  period: string;
  category: string;
  budget: number;
  deadline: number;
  candidate: number;
  candidateTotal: number;
  rating: number;

}

const Work = ({ title, company, period, category, budget, deadline, candidate, rating, candidateTotal }: WorkProps) => {
  return (
    <div className="flex justify-center mt-10 ">

      <div className="flex px-10 justify-between items-center w-screen h-[150px] bg-bgGreen border border-mainGreen rounded-lg">

        <div className="flex flex-col">
          <span className="font-bold text-xl">{title} _ {company}</span>
          <span className="text-subTxt text-sm mr-5">{period} _ {budget}원</span>
          <span className="font-bold text-subTxt">{category}</span>
        </div>

        <div className="flex items-center">
          <div className="w-[2px] h-[120px] bg-mainGreen mr-10"></div>
          <div className="flex flex-col">
            <span>마감 {deadline}일전</span>
            <span>지원자 {candidate}명/{candidateTotal}명</span>
            <div>평점 {rating}</div>
          </div>
        </div>

      </div>
    </div>

  )
}
export default Work;