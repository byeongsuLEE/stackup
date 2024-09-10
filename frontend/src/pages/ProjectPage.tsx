import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, Tab } from '@mui/material';
import React from 'react';
import ContractDone from '../components/ProjectPage/ContractDone';
import ContractIng from '../components/ProjectPage/ContractIng';

const Project = () => {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <div className='mt-10'>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
              <Tab label="계약 진행" value="1" />
              <Tab label="계약 완료" value="2" />
            </TabList>
          </Box>
          <div className='flex justify-center'>
            <TabPanel value="1">
              <div className='mt-5'>
                <ContractIng />
              </div>
            </TabPanel>
            <TabPanel value="2">
              <div className='mt-5'>
                <ContractDone />
              </div>
            </TabPanel>
          </div>
        </TabContext>
      </Box>
    </div>

  )
}
export default Project;