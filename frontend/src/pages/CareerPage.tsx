import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Tab } from "@mui/material";
import React from "react";
import NFTDisplay from "../components/NFTPage/NFTDisplay";
import RegisteredCareerList from "../components/CareerPage/RegisteredCareerList";

const Career = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  
  return (
    <div className='mt-10'>

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