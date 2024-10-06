import { useEffect, useState } from "react";
import { getProject } from "../../apis/ProjectApi";
import SignListBox from "./SignListBox";
import { project } from "../../apis/Board.type";
import ClientSignListBox from "./ClientSignListBox";


const SignList = () => {
  const [ signList, setSignList ] = useState<project[]>([]);

  useEffect(() => {
    const update = async () => {
      const data = await getProject('PENDING');
      setSignList(data)
    }

    update();
  }, [])

  return (
    <div className="flex flex-col w-[1000px] items-center mt-[50px]">
      {sessionStorage.getItem('userType') === 'client' ? (
        signList.map((sign: project) => (
          <div className="w-[1000px]" key={sign.projectId}>
            <ClientSignListBox {...sign} />
          </div>
        ))
      ) : (
        signList.map((sign: project) => (
          <div className="w-[1000px]" key={sign.projectId}>
            <SignListBox {...sign} />
          </div>
        ))
      )}
      
    </div>
  )
}

export default SignList;