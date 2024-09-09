import Introduce from "../components/MyPage/Introduce";
import MyRating from "../components/MyPage/Rating";

const Mypage = () => {
  return (
    <div className="mx-10 mt-20 flex justify-center">
      <MyRating />
      <Introduce/>
    </div>
  )
}

export default Mypage;