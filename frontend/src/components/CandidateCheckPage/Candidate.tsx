import { projectApplicantProps } from "../../apis/Board.type";
import ChatStartButton from "../common/ChatStartButton";
import DoneButton from "../common/DoneButton";

interface CandidateProps {
  name: string;
  rating: number; // totalScore에 해당
  portfolio: string; // portfolioUrl에 해당
  freelancerId: number; // id에 해당
}

const Candidate = ({
  name,
  rating,
  portfolio,
  freelancerId,
}: CandidateProps) => {
const Candidate = ({ name,  portfolioUrl, totalScore, id }: projectApplicantProps) => {

  return (
    <tr>
      <td>
        <div className="form-control">
          <label className="cursor-pointer label">
            <input type="checkbox" className="checkbox checkbox-success" />
          </label>
        </div>
      </td>
      <td>{name}</td>
      <td>{totalScore}</td>
      <td>
        <a href={portfolioUrl}>{portfolioUrl}</a>
      </td>
      <td className="flex justify-center mt-1.5">
        <div className="mr-3">
          <DoneButton width={60} height={30} title="프로필" />
        </div>
        <ChatStartButton freelancerId={freelancerId.toString()} />
      </td>
    </tr>
  );
};

export default Candidate;
