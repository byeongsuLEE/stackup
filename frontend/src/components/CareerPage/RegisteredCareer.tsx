import { Link } from "react-router-dom";
import WebIcon from "../../icons/WebIcon";
import DoneButton from "../common/DoneButton";

const RegisteredCareer = () => {
  const isList = false;

  return (
    <div>
      {isList ? (
        <div className="bg-bgGreen border border-mainGreen rounded-xl w-[1000px] mb-5 p-10 h-[200px] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg">프로젝트명</span>
            <span className="text-sm text-subTxt my-2">프로젝트 기간</span>
          </div>
          <div>
            <WebIcon w={30} h={30} />
          </div>
        </div>
      ) : (
        <Link to="/career/register">
        <DoneButton width={150} height={40} title="경력 등록하기" />
        </Link>
      )}
    </div>
  )
}
export default RegisteredCareer;