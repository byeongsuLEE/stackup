import { freelanceInformation } from "../../store/FreelanceStore";

const Introduce =  (data: freelanceInformation) => {
  
  return (
    <div className="bg-bgGreen flex justify-between flex-col p-10 border mx-10 border-mainGreen w-[500px] h-[200px] rounded-lg">
    <span>한 줄 자기소개 : {data.selfIntroduction}</span>
    <span className="mt-2 text-subTxt text-sm">포트폴리오 링크 : {data.portfolioURL}
      </span>
  </div>
  )
}

export default Introduce;