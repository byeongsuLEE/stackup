import { useNavigate } from "react-router-dom";

const SelectSignup = () => {
  const navigate  = useNavigate();
  const toClient = () => {
    navigate('/signup/client');
  }
  const toFreelancer = () => {
    navigate('/signup/freelancer');
  }
  return (
    <>
      <button onClick={toClient} className="bg-bgGreen w-[200px] h-[200px] rounded-3xl mx-10 border border-mainGreen border-2 font-bold">클라이언트</button>
      <button onClick={toFreelancer} className="bg-bgGreen w-[200px] h-[200px] rounded-3xl mx-10 border border-mainGreen border-2 font-bold">프리랜서</button>
    </>
  )
}
export default SelectSignup;
