import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { project } from "../../apis/Board.type";

const AppliedBox = ({ title, client, period, startDate, boardId }: project) => {
  const navigate = useNavigate();

  const toDetail = ()=>{
    navigate(`/work/detail/${boardId}`);
  }

  if (period === '일') {
    period = '0'
  }

  const projectPeriod = startDate + ' ~ ' + format(addDays(startDate, parseInt(period, 10)), 'yyyy-MM-dd');
  
  return (
    <div onClick={toDetail} className="bg-bgGreen border my-2 border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{title} _ {client.businessName}</span>
        <span className="text-subTxt">{projectPeriod}</span>
      </div>
    </div>
  )
}
export default AppliedBox;