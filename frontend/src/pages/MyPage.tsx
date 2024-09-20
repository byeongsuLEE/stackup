import { useEffect } from "react";
import Introduce from "../components/MyPage/Introduce";
import MyRating from "../components/MyPage/Rating";
import UserInfo from "../components/MyPage/UserInfo";
import { freelanceStore } from "../store/FreelanceStore";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const state = freelanceStore();
  const navigate = useNavigate();

  // == 토큰 완료시 주석해제 ==//
  useEffect(() => {
    if (window.sessionStorage.getItem("token") == null) {
      navigate("/login")
      
    } else if (state.email == "") {
      navigate("/signup/freelancer")
    }
  }, [])
  
  return (
    <div className="flex flex-col">
    <div className="mx-10 mt-20 flex justify-center">
      <MyRating {...state}/>
      <Introduce {...state}/>
    </div>
      <UserInfo {...state}/>
    </div>
  )
}

export default Mypage;