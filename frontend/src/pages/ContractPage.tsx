import { useParams } from "react-router-dom";
import ContractDetail from "../components/ContractPage/ContractDetail";
import DoneButton from "../components/common/DoneButton";
import { useQuery } from "react-query";
import { projectDetail } from "../apis/BoardApi";
import { selectedCandidate } from "../apis/ClientApi";

const Contract = () => {
  const { boardId, freelancerProjectId } = useParams();

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project', 'boardId'],
    queryFn: () => projectDetail(boardId!),
    enabled: !!boardId,
  });

  const { data: candidateList, isLoading: isCandidateLoading } = useQuery({
    queryKey: ['candidate', boardId],
    queryFn: async () => {
      const data = await selectedCandidate(boardId!);
      return data.find(element => Number(element.freelancerProjectId) === Number(freelancerProjectId));
    },
    enabled: !!boardId,
  });

  if (isProjectLoading || isCandidateLoading) {
    return <div>Loading...</div>;
  }

  if (!project || !candidateList) {
    return <div>데이터를 불러오지 못했습니다.</div>;
  }

  const submitContract = async () => {

  };

  return (
    <div className="my-20">
      <span className="font-bold text-subGreen1 text-lg">계약 페이지</span>
      <div className="bg-subTxt w-auto h-[1px] flex justify-center my-5"></div>

      <ContractDetail project={project} candidate={candidateList} />

      <div className="mt-5 text-end mr-10" onClick={submitContract}>
        <DoneButton height={30} width={150} title="제출" />
      </div>
    </div>
  );
};

export default Contract;
