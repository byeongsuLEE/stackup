import Client from "../components/Loginpage/Client";
import Freelance from "../components/Loginpage/Freelance";

const Login = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex items-center my-5">
        <span className="">클라이언트</span>
        <input type="checkbox" className="toggle toggle-success" defaultChecked />
        <span>프리랜서</span>
      </div>
      <Freelance />
      <Client/>
    </div>
  )
}

export default Login;