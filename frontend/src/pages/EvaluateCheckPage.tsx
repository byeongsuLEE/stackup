import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { projectApplicantProps } from "../apis/Board.type";
import { projectFreelancer } from "../apis/BoardApi";
import { projectStep } from "../apis/ProjectApi";
import Freelancer from "../components/EvaluateCheckPage/Freelancer";
import DoneButton from "../components/common/DoneButton";

const EvaluateCheck = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const NumericProjectId = projectId ? Number(projectId) : null;
  const location = useLocation();
  const { userId, stepResponse, boardId } = location.state;
  const navigate = useNavigate();
  const [evalList, setEvalList] = useState<projectApplicantProps[]>([]);

  const setStep = async () => {
    try {
      if (NumericProjectId) {
        await projectStep(NumericProjectId, stepResponse, true);
      }
      navigate(`/project/detail/${projectId}`, { state: { userId, stepResponse, boardId } });
    } catch (error) {
      console.error("Error updating project step:", error);
    }
  };

  useEffect(() => {
    const fetchProjectFreelancer = async () => {
      try {
        const response = await projectFreelancer(boardId);
        // 비밀번호 유무 확인
        // checkPassword();
        // 비밀번호 없으면 비밀번호 설정 페이지로 이동
        setEvalList(response);

      } catch (error) {
        console.error("Error fetching project freelancer:", error);
      }
    };

    if (boardId) {
      fetchProjectFreelancer();
    }

  }, [boardId]);

  return (
    <div className="m-10">
      {stepResponse === "DEVELOPMENT" ? (
        <span className="font-bold text-subGreen1 text-lg">중간평가 관리</span>
      ) : (
        <span className="font-bold text-subGreen1 text-lg">최종평가 관리</span>
      )}
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>
      <table className="table">
        <thead>
          <tr>
            <th>이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {evalList?.map((freelancer: projectApplicantProps, index: number) => (
            <Freelancer
              boardId={boardId}
              key={index}
              stepResponse={stepResponse}
              freelancer={freelancer}
            />
          ))}
        </tbody>
      </table>
      <div className="text-end mt-5" onClick={setStep}>
        <DoneButton width={120} height={30} title="단계 완료 하기" />
      </div>
    </div>
  );
};

export default EvaluateCheck;
