import { useNavigate } from "react-router-dom";
import { project } from "../../apis/Board.type";
import DoneButton from "../common/DoneButton";

const SignListBox = (sign: project) => {
<<<<<<< HEAD
  const freelancerProjectId = sign.freelancerProjectId;
  const projectId = sign.projectId;
  const navigate = useNavigate();
  const toDetail = () => {
    navigate(`/signature/detail/${freelancerProjectId}`, { state: { projectId: projectId } });
  }
  console.log(sign.projectId);
=======
>>>>>>> 9da11600db1da8ee22a1769470b49eddcc589c43

  return (
    <div className="bg-bgGreen border my-2 border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{sign.title} _ {sign.client.businessName}</span>
        <span>{sign.period}</span>
      </div>

      {sign.clientContractSigned ? (
<<<<<<< HEAD
        <div onClick={toDetail}>
=======
        <Link to={`/signature/detail/${sign.projectId}/${sign.freelancerProjectId}`}>
>>>>>>> 9da11600db1da8ee22a1769470b49eddcc589c43
          <DoneButton width={120} height={30} title="서명하기" />
        </div>
      ) : (
        <button disabled className="bg-subGreen2 text-white rounded-lg px-2 font-bold text-sm w-[120px] h-[30px]" >계약서 생성중</button>
      )}

    </div>
  )
}
export default SignListBox;