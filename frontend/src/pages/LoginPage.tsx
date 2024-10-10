import { useState } from "react";
import Client from "../components/Loginpage/Client";
import Freelance from "../components/Loginpage/Freelance";

const Login = () => {
  const [isChecked, setIsChecked] = useState(true);
  return (
    <div className="flex flex-col items-center mt-10">
      <div className="flex items-center mt-5 mb-10">
        <span className="text-sm mx-2">클라이언트</span>
        <input type="checkbox" className="toggle toggle-success"
        defaultChecked={isChecked}
        onClick={()=>(
          isChecked ? setIsChecked(false) : setIsChecked(true)
        )} />
        <span className="text-sm mx-2">프리랜서</span>
      </div>
      {isChecked? <Freelance /> : <Client />}
    </div>
  )
}

export default Login;