import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

interface DateProps {
  title:string;
}

const CalenderRange = ({title}:DateProps) => {

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
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
    </div>
  )
}
export default CalenderRange;