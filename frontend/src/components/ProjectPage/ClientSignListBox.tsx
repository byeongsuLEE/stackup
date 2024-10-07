import { useNavigate } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import { project } from "../../apis/Board.type";

const ClientSignListBox = (sign: project) => {
  const navigate = useNavigate();

  const boardId = sign.boardId
  const projectId = sign.projectId

  const goToTargetPage = () => {
    navigate(`/work/detail/select/${boardId}/${projectId}`)
  }

  return (
    <div className="bg-bgGreen border my-2 border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{sign.title} _ {sign.client.businessName}</span>
        <span>{sign.period}</span>
      </div>

      <div onClick={goToTargetPage}>
        <DoneButton width={120} height={30} title="서명하기" />
      </div>
    </div>
  )
}

export default ClientSignListBox;