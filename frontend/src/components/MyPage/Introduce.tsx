import { freelanceInformation } from "../../store/FreelanceStore";

const Introduce =  (data: freelanceInformation) => {
  
  return (
    <div className="bg-bgGreen flex flex-col p-10 border mx-10 border-mainGreen w-[500px] h-[200px] rounded-lg">
    <span>{data.selfIntroduction}</span>
    <span>{data.portfolioURL}</span>
  </div>
  )
}

export default Introduce;