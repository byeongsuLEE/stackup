import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { freelanceMypage, getClientFreelancerProfile } from "../apis/UserApi";
import Introduce from "../components/MyPage/Introduce";
import MyRating from "../components/MyPage/Rating";
import UserInfo from "../components/MyPage/UserInfo";
import { freelanceStore } from "../store/FreelanceStore";

const Mypage = () => {
  const state = freelanceStore();
  const navigate = useNavigate();
  const userId = useParams().accountId;

  useEffect(() => {
    const update = () => {
      const userType = window.sessionStorage.getItem('userType');
      if (userType === "freelancer") {
        freelanceMypage();
      } else if (userType === "client" && userId) {
        getClientFreelancerProfile(userId);
      } 
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
        <MyRating {...state} />
        <Introduce {...state} />
      </div>
      <UserInfo {...state} />
    </div>
  )
}

export default Mypage;