import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Dayjs } from 'dayjs';

interface BasicDatePickerProps {
  onChange: (date: Dayjs | null) => void;
}

export default function BasicDatePicker({ onChange }: BasicDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>

        <DatePicker
          onChange={onChange}
          slotProps={{ textField: { size: 'small' } }}
          className='w-96'
        />
    
      </DemoContainer>
    </LocalizationProvider>
  );
}