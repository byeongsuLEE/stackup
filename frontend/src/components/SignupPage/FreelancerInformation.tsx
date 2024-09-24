import { useNavigate } from "react-router-dom";
import { freelanceStore } from "../../store/FreelanceStore";
import Button from "../common/DoneButton";

const FreelancerInfo = () => {
  const navigate = useNavigate();

  const toSkill = () => {
    navigate("/signup/freelancer/skill");
  }

  const state = freelanceStore();

  return (

    <div className="bg-bgGreen flex flex-col w-[800px] h-[530px] border border-mainGreen ">
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold mt-10 mb-2 text-subGreen2">
          프리랜서로 시작하기
        </span>
        <span className="text-sm mb-10 text-subTxt">
          서비스 이용에 필요한 정보를 입력해주세요.
        </span>
      </div>

      <form>
        <div className="flex flex-col ml-10">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            className="border my-2 px-2  border-gray-400 w-48 h-8 rounded-md"
            type="text"
            onChange={(e) => state.setName(e.target.value)}
          />

          <label htmlFor="email">이메일</label>
          <input
            id="email"
            placeholder="ssafy@ssafy.com"
            className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
            type="text"
            onChange={(e) => state.setEmail(e.target.value)}
          />

          <label htmlFor="address">주소</label>
          <input
            id="address"
            placeholder="서울시 강남구 논현동"
            className="border my-2 border-gray-400 px-2  w-48 rounded-md h-8"
            type="text"
            onChange={(e) => state.setAddress(e.target.value)}
          />

          <label htmlFor="phoneNumber">연락처</label>
          <input
            id="phoneNumber"
            placeholder="010-1234-5678"
            className="px-2  border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            onChange={(e) => state.setPhone(e.target.value)}
          />
        </div>

        <div onClick={toSkill} className="flex justify-end mr-10 my-5">
          <Button height={40} width={100} title="다음" />
        </div>
      </form>
    </div>
  )
}
export default FreelancerInfo;