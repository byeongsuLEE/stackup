import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { Dayjs } from 'dayjs';
import { useState } from 'react';

interface DateProps {
  title:string;
  onDateChange: (date: string | null) => void;
}

const CalenderRange = ({title, onDateChange}: DateProps) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleDateChange = (newDate: Dayjs | null) => {
    setSelectedDate(newDate);
    onDateChange(newDate ? newDate.format('YYYY-MM-DD') : null);
  };

  return (
    <div className='mx-2]'>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'DateTimePicker',
          'TimePicker',
          'DateRangePicker',
          'DateTimeRangePicker',
        ]}
      >
        <DemoItem label={title} component="DateRangePicker">
          <DatePicker
            value={selectedDate} // Bind the selected date
            onChange={handleDateChange} // Handle the change
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
    </div>
  )
}
export default CalenderRange;