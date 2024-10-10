import RegisterForm from "../components/CareerRegisterPage/RegisterForm";

const CareerRegister = () => {
  return (
    <div className="m-20">
      <span className="text-lg font-bold ml-20 text-subGreen1">
        프로젝트 등록
      </span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center mx-10 my-5"></div>
      <RegisterForm />
    </div>
  )
}
export default CareerRegister;