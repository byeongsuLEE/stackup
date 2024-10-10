import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

interface RadiosProps {
  title: string;
  option1: string;
  option2: string;
  option3?: string;
  value: number | null;
  value1: number; // 추가된 속성
  value2: number; // 추가된 속성
  value3?: number; // 추가된 속성
  onChange: (value: number) => void; // 선택된 값을 부모로 전달하는 함수
}

const Radios = ({ title, option1, option2, option3, value, value1, value2, value3, onChange }: RadiosProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value)); // 선택된 값을 부모로 전달
  };
  
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{title}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={value ?? ''} // 선택된 값 설정
        onChange={handleChange} // onChange 이벤트 처리
      >
        <FormControlLabel value={value1} control={<Radio size="small" color="success" />} label={option1} />
        <FormControlLabel value={value2} control={<Radio size="small" color="success" />} label={option2} />
        {option3 && (
          <FormControlLabel value={value3} control={<Radio size="small" color="success" />} label={option3} />
        )}
      </RadioGroup>
    </FormControl>
  )
}
export default Radios;