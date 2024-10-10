import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Tab } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import RegisteredCareerList from "../components/CareerPage/RegisteredCareerList";
import NFTDisplay from "../components/NFTPage/NFTDisplay";
import NFTMinting from "../components/NFTPage/NFTMinting";
import { handlePrint } from "../hooks/MakePDF";
import { CallTest } from "../hooks/Test";

const Career = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [pdf, setPdf] = useState<any>();
  const { Minting, isLoading } = CallTest(); // Minting 함수 가져옴
  const location = useLocation();
  const projectId = location.state.projectId;


  //== pdf 생성 ==//
  const componentRef = useRef<HTMLDivElement>(null);



  useEffect(() => {

    //== pdf 생성 ==//
    const MakePDF = async () => {
      const pdfData = await handlePrint(componentRef);
      setPdf(pdfData)
    }

    MakePDF();
  }, [isLoading]);




  return (
    <div className='mt-10'>

      <div ref={componentRef} >
        아자자
      </div>
        <NFTMinting projectId={projectId} Minting={Minting} isLoading={isLoading} pdf={pdf}  />
      

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