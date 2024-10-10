import { useNavigate } from "react-router-dom";
import { projectApplicantProps } from "../../apis/Board.type";
import DoneButton from "../common/DoneButton";

const Candidate = ({
  name,
  portfolioUrl,
  totalScore,
  id,
  onCheckboxChange,
}: projectApplicantProps) => {
  const checkCandidate = () => {
    onCheckboxChange(id);
  };

  const navigate = useNavigate();
  const toProfile = () => {
    navigate(`/mypage/${id}`);
  };

  return (
    <tr>
      <td>
        <div className="form-control">
          <label className="cursor-pointer label">
            <input
              type="checkbox"
              className="checkbox checkbox-success"
              onChange={checkCandidate}
            />
          </label>
        </div>
      </td>
      <td>{name}</td>
      <td>{totalScore}</td>
      <td>
        <a href={portfolioUrl}>{portfolioUrl}</a>
      </td>
      <td className="flex justify-center mt-1.5">
        <div onClick={toProfile} className="mr-3">
          <DoneButton width={60} height={30} title="프로필" />
        </div>
      </td>
    </tr>
  );
};
export default Candidate;
