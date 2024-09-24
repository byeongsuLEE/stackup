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
}

const Radios = ({ title, option1, option2, option3 }: RadiosProps) => {
  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">{title}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="1" control={<Radio size="small" color="success" />} label={option1} />
        <FormControlLabel value="2" control={<Radio size="small" color="success" />} label={option2} />
        <FormControlLabel value="3" control={<Radio size="small" color="success" />} label={option3} />
      </RadioGroup>
    </FormControl>
  )
}
export default Radios;