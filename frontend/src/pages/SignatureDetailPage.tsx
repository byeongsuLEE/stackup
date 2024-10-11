import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { contractData, signature } from "../apis/ContractApi";
import NFTMinting from "../components/NFTPage/NFTMinting";
import AlertBox from "../components/common/AlertBox";
import { handlePrint } from "../hooks/MakePDF";
import { MakeSign } from "../hooks/MakeSign";
import { CallTest } from "../hooks/Test";
import NFTLoading from "./NFTLoadingPage";

const SignatureDetail = () => {
  const [today] = useState(new Date());
  const { signMessage } = MakeSign();
  const { freelancerProjectId } = useParams();
  const [pdf, setPdf] = useState<any>();
  const { Minting, isLoading } = CallTest(); // Minting 함수 가져옴
  const location = useLocation();
  const projectId = location.state.projectId;
  const [showAlert, setShowAlert] = useState(false);


  //== pdf 생성 ==//
  const componentRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    //== 전자 서명 ==//
    const data = await signMessage();
    signature(data?.signedMessage, freelancerProjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
      // window.location.reload();
    }, 30000);
  }
  const { data: contract, isLoading: isProjectLoading } = useQuery({
    queryKey: ['contract', freelancerProjectId],
    queryFn: () => contractData(freelancerProjectId!),
    enabled: !!freelancerProjectId,
  });

  useEffect(() => {

    //== pdf 생성 ==//
    const MakePDF = async () => {
      const pdfData = await handlePrint(componentRef);
      setPdf(pdfData)
    }

    MakePDF();
  }, [isLoading, contract]);

  const formattedStart = contract?.contractStartDate?.split('T')[0];
  const formattedEnd = contract?.contractEndDate?.split('T')[0];
  if (isProjectLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div >

      {isLoading ? (
        <NFTLoading />
      ) : (
        <div>
          {showAlert && <AlertBox title="NFT 계약 요청 중입니다. 잠시만 기다려주세요." />}
          <div ref={componentRef} >
          <div className="bg-bgGreen border border-mainGreen h-auto w-auto p-5 mx-20 my-20">
            <div className="text-center text-lg font-bold">
              프리랜서 고용 계약서
            </div>
            <div className="flex flex-col">
              <br />
              <span className="font-bold text-sm">프로젝트명 : {contract.projectName}</span>
              <span className="font-bold text-sm">계약기간 : {contract.period} 일</span>
              <br />
              <span className="text-sm">{contract.contractCompanyName} (이하 “갑” 아리 한다.)와 {contract.candidateName}(이하 “을” 이라 한다.)는 프로젝트명에 명시된 업무작업을 수향하기 위해 다음과 같이 계약을 체결한다.</span>
              <br />
              <span className="font-bold text-sm">제 1조[목적]</span>
              <span className="text-sm">본 계약을 “갑”이 “을”에게 의뢰한 업무를 “갑”에게 공급함에 있어 “갑”과 “ 사이에 필요한 사항을 정하는 것을 목적으로 한다.</span>
              <br />
              <span className="font-bold text-sm">제 2조 [계약기간]</span>
              <span className="text-sm">계약 기간은 {formattedStart}일 부터 {formattedEnd}일 까지로 하며, 갑과 을의 합의 하에 본 계약기간은 연장 될 수 있다.</span>
              <br />
              <span className="font-bold text-sm">제 3조 [계약금액]</span>
              <span className="text-sm">총 계약금액은 {contract.contractTotalAmount}만원으로 하며, 계약금액 중 {contract.contractDownPayment}은 착수시점에 지급하고,
                잔금 {contract.contractFinalPayment}만원은 작업 완료 시 작업완료납품과 동시에 “갑”은 “을”에게 지급하기로
                한다.
                <br />
                단, 회사업무 수행을 위한 출장 등이 발생할 경우에는 “갑”이 그 비용을 지급하고,
                식대 등은 “을”의 비용으로 한다.</span>
              <br />
              <span className="font-bold text-sm">제 4조 [납품]</span>
              <span className="text-sm">“을”은 작업 진행중 중간 완료된 셩과물을 1회에 걸쳐 중간 납품을 하며, 최종 자료는 검토 및 수정 후 완성품으로 납품하기로 한다.</span>
              <br />
              <span className="font-bold text-sm">제 5조 [비밀유지]</span>
              <span className="text-sm">“을”은 본 작업과 관련된 어떠한 일체의 정보를 외부에 누설하거나 유출해서는 안되며 이로 인해 발생하는 모든 책임은 “을”이 진다.</span>
              <br />
              <span className="font-bold text-sm">제 6조 [자료제공]</span>
              <span className="text-sm">“갑”은 “을”이 작업을 수행하는데 필요한 일체의 자료를 제공하기로 한다.</span>
              <br />
              <span className="font-bold text-sm">제 7조 [근무조건]</span>
              <span className="text-sm">
                (1) 본 계약상의 업무를 수행하기 위해 출근 등과 관련된 사항은 자유로 한다.<br />
                (2) 본 계약 내용 외에도 다른 필요한 업무가 필요한 경우 “갑”은 “을”이 추가로 작업을 수행하는 부분에 대한 인건비와 계약 기간은 상호 협의 하에 결정된다.</span>
              <br />
              <span className="font-bold text-sm">제 8조 [해지]</span>
              <span className="text-sm">“갑”과 “을”은 다음 각 호에 해당될 경우 본 계약을 해지할 수 있다.
                <br />
                <br />
                (1) 정당한 이유 없이 작업 진행이 이루어지지 않을 때 <br />
                (2) 정당한 이유 없이 계약기간에 작업완료가 불가능 하다고 판단될 때 <br />
                (3) “갑”이 계약금을 지금하지 않았을 경우</span>
              <br />
              <span className="font-bold text-sm">제 9조 [손해배상]</span>
              <span className="text-sm">“을”의 귀책사유로 인하여 본 계약이 불이행이 되었을 경우 “을”은 “갑”이 제시한 손해배상의 책임을 진다.</span>
              <br />
              <span className="font-bold text-sm">제 10조 [소송관할]</span>
              <span className="text-sm">본 계약으로 발생하는 분쟁은 관할지방법원을 관할법원으로 한다.</span>
              <br />
              <span className="text-sm">각 당사자는 위 계약을 증명하기 위하여 본 계약서 2통을 작성하여 각각 서명(또는 기명)날인 후 “갑”과 “을”이 각각 1통씩 보관한다.</span>
              <br />
              <label htmlFor="condition" className="font-bold text-sm">추가 특약사항</label>
              <span className="text-sm">{contract.contractAdditionalTerms}</span>
              
              <div className="text-center my-10 font-bold">
              계약일자 : {today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일
            </div>
            </div>
          </div>

          <div onClick={handleSubmit}>
            <NFTMinting projectId={projectId} Minting={Minting} isLoading={isLoading} pdf={pdf} contractData={contract}/>
          </div>
        </div>
        </div>
        )}
        
    </div>
  )
}

export default SignatureDetail;