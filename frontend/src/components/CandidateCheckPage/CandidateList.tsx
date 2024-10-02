import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DoneButton from "../common/DoneButton";
import Candidate from "./Candidate";
import { useUserStore } from "../../store/UserStore";

// API 응답에 맞는 타입 정의
interface CandidateType {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalScore: number;
  reportedCount: number;
  isPassed: boolean;
  portfolioUrl: string;
}

const CandidateList = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useUserStore((state) => ({
    token: state.token,
  }));

  const toProjectGroup = () => {
    navigate(`/work/projectgroup/${boardId}`);
  };

  useEffect(() => {
    if (!boardId) {
      setError("Invalid board ID");
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          `/api/board/${boardId}/applicant-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API 응답 데이터:", response.data); // 응답 데이터 확인

        const data = response.data;

        // 예시 1: data.candidates가 배열인 경우
        if (Array.isArray(data.candidates)) {
          setCandidates(data.candidates);
        }
        // 예시 2: data 자체가 배열인 경우
        else if (Array.isArray(data)) {
          setCandidates(data);
        } else {
          throw new Error(
            "Expected an array in 'candidates' or 'data', but got something else."
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching applicants:", error);
        setError("Failed to fetch applicants");
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [boardId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>채용 여부</th>
            <th>이름</th>
            <th>평점</th>
            <th>포트폴리오</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <Candidate
                key={candidate.id}
                name={candidate.name}
                portfolio={candidate.portfolioUrl}
                rating={candidate.totalScore}
                freelancerId={candidate.id}
              />
            ))
          ) : (
            <tr>
              <td colSpan={5}>No applicants found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-end mt-5" onClick={toProjectGroup}>
        <DoneButton width={150} height={30} title="시작하기" />
      </div>
    </div>
  );
};

export default CandidateList;
