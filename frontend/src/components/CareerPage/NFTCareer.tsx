import { useNavigate } from "react-router-dom";
import DoneButton from "../common/DoneButton";
import NFT from "./NFT";

const NFTCareer = () => {
  const isNFT = true;
  const navigate = useNavigate();
  const toWork = () => {
    navigate('/work')
  }
  const toDetail = () => {
    navigate('/career/detail')
  }
  return (
    <div className="flex flex-wrap">
      {isNFT ? (
        <div onClick={toDetail} className="w-full sm:w-1/3 lg:w-1/4">
          <NFT name="이호영" title="SSAPICK" period="2024-08-01 ~ 2024-08-31" />
        </div>
      ) : (
        <div onClick={toWork}>
          <DoneButton width={150} height={40} title="프로젝트 찾기" />
        </div>
      )}
    </div>

  )
}
export default NFTCareer;