import { addDays, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { projectList } from "../../apis/Project.type";

const AppliedBox = ({ title, businessName, period, startDate,boardId }: projectList) => {
  const navigate = useNavigate();
  const toDetail = ()=>{
    navigate(`/work/detail/${boardId}`);
  }

  const projectPeriod = startDate + ' ~ ' + format(addDays(startDate, parseInt(period, 10)), 'yyyy-MM-dd');
  return (
    <div onClick={toDetail} className="bg-bgGreen border my-2 border-mainGreen h-[150px] w-full rounded-lg p-5 flex justify-between items-center">
      <div className="flex flex-col justify-center">
        <span className="mb-3">{title} _ {businessName}</span>
        <span className="text-subTxt">{projectPeriod}</span>
      </div>
    </div>
  )
}
export default AppliedBox;