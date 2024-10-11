import { SubmitHandler, useForm } from "react-hook-form";
import { clientSignupInfo } from "../../apis/User.type";
import { clientSignup } from "../../apis/UserApi";
import Button from "../common/DoneButton";
import { useNavigate } from "react-router-dom";

const ClientInfo = () => {
  const { register, handleSubmit } = useForm<clientSignupInfo>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<clientSignupInfo> = (data) => {
    
    clientSignup(data);
    navigate("/");
  };

  return (
    <form>
      <div className="bg-bgGreen flex flex-col w-[800px] h-[750px] border border-mainGreen ">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold mt-10 mb-2 text-subGreen2">
            클라이언트로 시작하기
          </span>

          <span className="text-sm mb-10 text-subTxt">
            서비스 이용에 필요한 정보를 입력해주세요.
          </span>
        </div>

        <div className="flex flex-col ml-10">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            className="border my-2 px-2  border-gray-400 w-48 h-8 rounded-md"
            type="text"
            {...register("name", { required: "name is required." })}
          />

          <label htmlFor="userId">아이디</label>
          <input
            id="userId"
            placeholder="ssafy@ssafy.com"
            className="px-2 border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            {...register("email", { required: "email is required." })}
          />

          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            className="border my-2 px-2  border-gray-400 w-48 rounded-md h-8"
            type="password"
            {...register("password", { required: "password is required." })}
          />

          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <input
            id="passwordCheck"
            className="border my-2 px-2  border-gray-400 w-48 rounded-md h-8"
            type="password"
            {...register("passwordCheck", {
              required: "passwordCheck is required.",
            })}
          />

          <label htmlFor="businessNumber">사업자 등록 번호</label>
          <input
            id="businessNumber"
            className="border my-2 px-2  border-gray-400 w-48 rounded-md h-8"
            type="text"
            {...register("businessRegistrationNumber", {
              required: "businessRegistrationNumber is required.",
            })}
          />

          <label htmlFor="company">기업명</label>
          <input
            id="company"
            className="border my-2 border-gray-400 px-2  w-48 rounded-md h-8"
            type="text"
            {...register("businessName", {
              required: "businessName is required.",
            })}
          />

          <label htmlFor="phoneNumber">연락처</label>
          <input
            id="phoneNumber"
            placeholder="010-1234-5678"
            className="px-2  border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            {...register("phone", { required: "phone is required." })}
          />
        </div>

        <div
          className="flex justify-end mr-10 my-5"
          onClick={handleSubmit(onSubmit)}
        >
          <Button height={40} width={100} title="회원가입" />
        </div>
      </div>
    </form>
  );
};

export default ClientInfo;