import { useEffect } from "react";
import Introduce from "../components/MyPage/Introduce";
import MyRating from "../components/MyPage/Rating";
import UserInfo from "../components/MyPage/UserInfo";
import { freelanceStore } from "../store/FreelanceStore";
import { freelanceMypage } from "../apis/UserApi";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const state = freelanceStore();
  const navigate = useNavigate();

  useEffect(() => {
    const update = () => {
      freelanceMypage();
    }

    if (window.sessionStorage.getItem('token') == null) {
      navigate('/login')
    } else {
      update();
    }

    
  }, [])
  
  return (
    <div className="flex flex-col">
    <div className=" mt-20 flex justify-center">
      <MyRating {...state}/>
      <Introduce {...state}/>
    </div>
      <UserInfo {...state}/>
    </div>
  )
}

export default Mypage;