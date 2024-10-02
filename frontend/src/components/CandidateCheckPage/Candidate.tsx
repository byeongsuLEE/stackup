import ChatStartButton from "../common/ChatStartButton";
import DoneButton from "../common/DoneButton";

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
      <td className="flex justify-center mt-1.5">
        <div className="mr-3">
          <DoneButton width={60} height={30} title="프로필" />
        </div>
        
        <ChatStartButton freelancerId={freelancerId} />
      </td>
    </tr>
  );
};
export default Candidate;
