import Introduce from "../components/MyPage/Introduce";
import MyRating from "../components/MyPage/Rating";
import UserInfo from "../components/MyPage/UserInfo";
import { freelanceStore } from "../store/FreelanceStore";

const Mypage = () => {
  const state = freelanceStore();

  return (
    <div className="flex flex-col">
    <div className="mx-10 mt-20 flex justify-center">
      <MyRating/>
      <Introduce/>
    </div>
      <UserInfo {...state}/>
    </div>
  )
}

export default Mypage;