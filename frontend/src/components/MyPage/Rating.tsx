import { freelanceInformation } from "../../store/FreelanceStore";
import Score from "../common/Score";

const  MyRating = (data: freelanceInformation) => {
  const userTypes = window.sessionStorage.getItem('userType');
  return (
    <div className="bg-bgGreen flex flex-col p-10 border border-mainGreen mx-10 w-[500px] h-[200px] rounded-lg">
      {userTypes === 'freelancer' ? <span className="mb-3">나의 평점</span> : <span className="mb-3">평점</span>}
      {/* <span className="mb-3">나의 평점</span> */}
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mb-2"></div>
      <div className="flex items-center">
      <Score />
      <span className="ml-5">{data.totalScore}</span>
      </div>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mt-2"></div>
    </div>
  )
}
export default MyRating;