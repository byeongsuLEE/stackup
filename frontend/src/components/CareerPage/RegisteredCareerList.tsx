import { Link } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import { useEffect, useState } from "react";
import { getProject } from "../../apis/ProjectApi";
import { project } from "../../apis/Board.type";
import RegisteredCareer from "./RegisteredCareer";

const RegisteredCareerList = () => {
  const [ list, setList ] = useState<project[]>();
  
  useEffect(() => {
    const update = async() => {
      const data = await getProject('BEFORE');
      setList(data);
    }

    update();
  }, [])


  return (
    <div>
      <Link className="mb-5 text-center" to="/career/register">
        <DoneButton width={150} height={40} title="경력 등록하기" />
        </Link>

      {list ? (
        list.map(project => (
          <RegisteredCareer {...project}/>
        ))
      ) : (
        <></>
      )}
    </div>
  )
}
export default RegisteredCareerList;