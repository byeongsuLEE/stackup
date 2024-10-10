import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Tab } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import NFTDisplay from "../components/NFTPage/NFTDisplay";
import RegisteredCareerList from "../components/CareerPage/RegisteredCareerList";
import NFTMinting from "../components/NFTPage/NFTMinting";
import { useQuery } from "react-query";
import { MakeSign } from "../hooks/MakeSign";
import { useLocation, useParams } from "react-router-dom";
import { CallTest } from "../hooks/Test";
import { contractData, signature } from "../apis/ContractApi";
import { handlePrint } from "../hooks/MakePDF";

const Career = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { signMessage } = MakeSign();
  const { freelancerProjectId } = useParams();
  const [pdf, setPdf] = useState<any>();
  const { Minting, isLoading } = CallTest(); // Minting 함수 가져옴
  const location = useLocation();
  const projectId = location.state.projectId;


  //== pdf 생성 ==//
  const componentRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    //== 전자 서명 ==//
    const data = await signMessage();
    signature(data?.signedMessage, freelancerProjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

   
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

  if (isProjectLoading) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className='mt-10'>
      <div ref={componentRef} >
        아자자
      </div>
      <div onClick={handleSubmit}>
      <NFTMinting projectId={projectId} Minting={Minting} isLoading={isLoading} pdf={pdf} contractData={contract}/>
      </div>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab label="프로젝트 NFT" value="1" />
              <Tab label="등록한 프로젝트" value="2" />
            </TabList>
          </Box>
          <div className='flex justify-center'>
            <TabPanel value="1">
              <div className='mt-5'>
                <NFTDisplay />
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className='mt-5'>
                <RegisteredCareerList />
              </div>
            </TabPanel>
          </div>
        </TabContext>
      </Box>

    </div>
  )
}
export default Career;