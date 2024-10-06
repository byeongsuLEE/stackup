import { candidate } from "../../apis/Freelancer.type";
import DoneButton from "../common/DoneButton";

const SelectedCandidate = ({ name,  portfolioUrl, totalScore }: candidate) => {

  return (
    <tr>
      <td className="text-center">{name}</td>
      <td className="text-center">{totalScore}</td>
      <td className="text-center">
        <a href={portfolioUrl}>{portfolioUrl}</a>
      </td >
      <td className="flex justify-center mt-1.5 center">
        <div className="mr-3">
          <DoneButton width={100} height={30} title="서명하기" />
        </div>
      </td>
    </tr>
  );
};
export default SelectedCandidate;
