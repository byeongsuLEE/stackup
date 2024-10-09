import { SubmitHandler, useForm } from "react-hook-form";
import { clientSignupInfo } from "../../apis/User.type";
import { clientSignup, checkId } from "../../apis/UserApi"; // checkId 추가
import Button from "../common/DoneButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ClientInfo = () => {
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<clientSignupInfo>();
  const navigate = useNavigate();
  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복 확인 여부

  const onSubmit: SubmitHandler<clientSignupInfo> = (data) => {
    if (!emailChecked) {
      setError("email", { type: "manual", message: "이메일 중복 확인이 필요합니다." });
      return;
    }

    clientSignup(data);
    navigate("/");
  };

  const handleEmailBlur = async (email: string) => {
    try {
      const isDuplicate = await checkId(email); // 이메일 중복 확인 API 호출
      if (isDuplicate) {
        setError("email", { type: "manual", message: "이미 사용 중인 이메일입니다." });
        setEmailChecked(false);
      } else {
        clearErrors("email");
        setEmailChecked(true);
      }
    } catch (error:any) {
      if (error.response && error.response.status === 409) {
        // 409 에러가 발생한 경우 처리
        setError("email", { type: "manual", message: "이미 사용 중인 이메일입니다." });
      } else {
        console.error("이메일 중복 확인 실패:", error);
      }
    }
  };
  

  return (
    <form>
      <div className="bg-bgGreen flex flex-col w-[800px] h-[750px] border border-mainGreen">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold mt-10 mb-2 text-subGreen2">
            클라이언트로 시작하기
          </span>

          <span className="text-sm mb-10 text-subTxt">
            서비스 이용에 필요한 정보를 입력해주세요.
          </span>
        </div>

        <div className="flex flex-col ml-10">
          {/* 이름 필드 */}
          <label htmlFor="name">이름</label>
          <input
            id="name"
            className="border my-2 px-2 border-gray-400 w-48 h-8 rounded-md"
            type="text"
            {...register("name", { required: "name is required." })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* 이메일 필드 */}
          <label htmlFor="userId">아이디</label>
          <input
            id="userId"
            placeholder="ssafy@ssafy.com"
            className="px-2 border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            {...register("email", { 
              required: "email is required.",
              onBlur: (e) => handleEmailBlur(e.target.value) // 이메일 입력 후 포커스가 벗어날 때 중복 확인
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>}

          {/* 비밀번호 필드 */}
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
            type="password"
            {...register("password", { required: "password is required." })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          {/* 비밀번호 확인 필드 */}
          <label htmlFor="passwordCheck">비밀번호 확인</label>
          <input
            id="passwordCheck"
            className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
            type="password"
            {...register("passwordCheck", {
              required: "passwordCheck is required.",
            })}
          />
          {errors.passwordCheck && <p className="text-red-500">{errors.passwordCheck.message}</p>}

          {/* 사업자 등록 번호 필드 */}
          <label htmlFor="businessNumber">사업자 등록 번호</label>
          <input
            id="businessNumber"
            className="border my-2 px-2 border-gray-400 w-48 rounded-md h-8"
            type="text"
            {...register("businessRegistrationNumber", {
              required: "businessRegistrationNumber is required.",
            })}
          />
          {errors.businessRegistrationNumber && <p className="text-red-500">{errors.businessRegistrationNumber.message}</p>}

          {/* 기업명 필드 */}
          <label htmlFor="company">기업명</label>
          <input
            id="company"
            className="border my-2 border-gray-400 px-2 w-48 rounded-md h-8"
            type="text"
            {...register("businessName", {
              required: "businessName is required.",
            })}
          />
          {errors.businessName && <p className="text-red-500">{errors.businessName.message}</p>}

          {/* 연락처 필드 */}
          <label htmlFor="phoneNumber">연락처</label>
          <input
            id="phoneNumber"
            placeholder="010-1234-5678"
            className="px-2 border my-2 h-8 border-gray-400 w-48 rounded-md"
            type="text"
            {...register("phone", { required: "phone is required." })}
          />
          {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
        </div>

        {/* 버튼 */}
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
