import { useNavigate, useParams } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import { candidate } from "../../apis/Freelancer.type";

const Group = ({ name }: candidate) => {
  const boardId = useParams<{ boardId: string }>().boardId;
  const navigate = useNavigate();

  const toContract = () => {
    navigate(`/work/detail/contract/${boardId}`);
  }

  return (
    <tr>
      <td className="p-0 pl-10" >{name}</td>
      <div className="my-2 text-end pr-10" onClick={toContract}>
        <DoneButton width={100} height={30} title="계약서 작성" />
      </div>

    </tr>
  );
}



export default Group;
