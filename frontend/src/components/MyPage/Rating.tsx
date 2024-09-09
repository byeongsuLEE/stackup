import Score from "../common/Score";

const  MyRating = () => {
  return (
    <div className="bg-bgGreen flex flex-col p-10 border border-mainGreen mx-10 w-[500px] h-[200px] rounded-lg">
      <span className="mb-3">나의 평점</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mb-1"></div>
      <div className="flex items-center">
      <Score />
      <span className="ml-5">0.0</span>
      </div>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mt-1"></div>
      <div className="mt-5">
        내가 받은 리뷰
      </div>
    </div>
  )
}
export default MyRating;