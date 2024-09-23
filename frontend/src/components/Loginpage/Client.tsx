import { SubmitHandler, useForm } from "react-hook-form";
import { clientLoginInfo } from "../../apis/User.type";
import { clientLogin } from "../../apis/UserApi";
import DoneButton from "../common/DoneButton";
import { Link, useNavigate } from "react-router-dom";

const Client = () => {
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<clientLoginInfo>();

  const onSubmit: SubmitHandler<clientLoginInfo> = (data) => {
    clientLogin(data);
    navigate('/');
  };

  return (
    <form>
      <div className="flex flex-col mb-20 items-center justify-center w-96 h-96 rounded-lg bg-gray-100">
        <img
          className="h-28 mb-5"
          src="./logos/Stackup_Logo_Round.png"
          alt="GithubLogo"
        />
        <div className="flex flex-col">
          <input
            className="border my-1 h-10 w-72 border-gray-300 rounded-xl px-2"
            type="text"
            placeholder="ID"
            {...register("email", { required: "email is required." })}
          />
          <input className="border my-1 h-10 w-72 border-gray-300 rounded-xl px-2" type="password" placeholder="PASSWORD"
            {...register("password", { required: "password id required." })}
          />
        </div>

        {/* <button
          onClick={handleSubmit(onSubmit)}
          type="button"
          className="mt-10 theme-background-color font-bold rounded-2xl h-10 w-48 text-sm text-white "
        >
          로그인
        </button> */}
        <div
        onClick={handleSubmit(onSubmit)}
        className="mt-5 mb-3"
        >
        <DoneButton width={200} height={40} title="로그인" />
        </div>
          <Link to="/signup/client">
        <DoneButton width={200} height={40} title="회원가입" />
          </Link>

      </div>
    </form>
  );
};
export default Client;
