import { SubmitHandler, useForm } from "react-hook-form";
import { clientLogin } from "../../apis/User";

interface information {
  id: string,
  password: string
}

const Client = () => {
  const { register, handleSubmit } = useForm<information>();

  const onSubmit: SubmitHandler<information> = (data) => {
      clientLogin(data);
  };

  return (
    <form >
      <div className="flex flex-col mb-20 items-center justify-center w-96 h-96 rounded-lg bg-gray-100">
        <img className="h-28 mb-5" src="./logos/Stackup_Logo_Round.png" alt="GithubLogo" />
        <div className="flex flex-col" >
          <input className="border my-1 h-10 w-72 border-gray-300 rounded-xl" type="text" placeholder="ID"
            {...register("id", { required: "ID is required." })}
          />
          <input className="border my-1 h-10 w-72 border-gray-300 rounded-xl" type="password" placeholder="PASSWORD"
           {...register("password", { required: "password id required." })}
          />
        </div>

        <button onClick={handleSubmit(onSubmit)} type="button" className="mt-10 theme-background-color font-bold rounded-2xl h-10 w-48 text-sm text-white ">
          로그인
        </button>
      </div>
    </form>
  )
}
export default Client;