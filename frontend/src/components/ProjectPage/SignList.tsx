import { useEffect, useState } from "react";
import { getProject } from "../../apis/ProjectApi";
import SignListBox from "./SignListBox";
import { project } from "../../apis/Board.type";


const SignList = () => {
  const [ signList, setSignList ] = useState<project[]>([]);

  useEffect(() => {
    const update = async () => {
      const data = await getProject('PENDING');
      setSignList(data)
      console.log(data)
    }

    update();
  }, [])

  return (
    <div className="flex flex-col w-[1000px] items-center mt-[50px]">
      {signList.map((sign: project) => (
        <div className="w-[1000px]" key={sign.projectId}>
          <SignListBox {...sign} />
        </div>
      ))}
    </div>
  )
}

export default SignList;