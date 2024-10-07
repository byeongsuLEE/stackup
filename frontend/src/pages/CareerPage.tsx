import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Tab } from "@mui/material";
import React, { useEffect } from "react";
import RegisteredCareer from "../components/CareerPage/RegisteredCareer";
import NFTDisplay from "../components/NFTPage/NFTDisplay";
import NFTMinting from "../components/NFTPage/NFTMinting";
import { CallTest } from "../hooks/Test";
import NFTLoading from "./NFTLoadingPage";

const Career = () => {
  const [value, setValue] = React.useState('1');

  
  const { Minting, isLoading } = CallTest(); // Minting 함수 가져옴
    // useEffect를 사용하여 isLoading 상태가 변경될 때마다 작업을 처리
    useEffect(() => {
      if (isLoading) {
        console.log("로딩 중입니다...");
      } else {
        console.log("로딩이 완료되었습니다.");
      }
    }, [isLoading]); // isLoading 상태가 변경될 때마다 실행

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div className='mt-10'>
      <NFTMinting Minting={Minting} isLoading={isLoading} />
      {isLoading?(
        <NFTLoading/>
      ):(
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
                <RegisteredCareer />
              </div>
            </TabPanel>
          </div>
        </TabContext>
      </Box>
      )}
    </div>
  )
}
export default Career;