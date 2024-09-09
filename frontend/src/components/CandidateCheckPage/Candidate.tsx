import DoneButton from "../common/DoneButton";

interface CandidateProps {
  name: string;
  rating: number;
  portfolio: string;
}
const Candidate = ({ name, rating, portfolio }: CandidateProps) => {

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
      <td>
        <DoneButton width={60} height={30} title="프로필" />
      </td>
    </tr>
  )
}
export default Candidate;