interface CandidateProps {
  name: string;
  rating: number;
  portfolio: string;
  ischecked: boolean;
}
const Candidate = ({ name, rating, portfolio, ischecked }: CandidateProps) => {
  return (
    <tr>
      <td>{ischecked}</td>
      <td>{name}</td>
      <td>{rating}</td>
      <td>
        <a href={portfolio}>{portfolio}</a>
      </td>
    </tr>
  )
}
export default Candidate;