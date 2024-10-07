import DoneButton from "../common/DoneButton";
import ChatStartButton from "../common/ChatStartButton";

interface CandidateProps {
  name: string;
  rating: number;
  portfolio: string;
  freelancerId: string;
}
const Candidate = ({
  name,
  rating,
  portfolio,
  freelancerId,
}: CandidateProps) => {
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
      <td>{rating}</td>
      <td>
        <a href={portfolio}>{portfolio}</a>
      </td>
      <td className="flex justify-between">
        <DoneButton width={60} height={30} title="프로필" />
        <ChatStartButton freelancerId={freelancerId} />
      </td>
    </tr>
  );
};
export default Candidate;
