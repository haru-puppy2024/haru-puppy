import { useEffect, useState } from 'react';
import Select from './Select';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import TextDropdown from './TextDropdown';

interface IRepeatSelectProps {
  onValueChange: (value: string) => void;
  initialValue?: string;
}

const RepeatSelect = ({ onValueChange, initialValue = 'NONE' }: IRepeatSelectProps) => {
  const options = ['없음', '매일', '매주', '매월', '매년'];
  const valueToOptionMap: { [key: string]: string } = {
    NONE: '없음',
    DAY: '매일',
    WEEK: '매주',
    MONTH: '매월',
    YEAR: '매년',
  };

  const initialSelectedValue = initialValue in valueToOptionMap ? initialValue : 'NONE';
  const [selectedValue, setSelectedValue] = useState(initialSelectedValue);

  useEffect(() => {
    setSelectedValue(initialValue);
  }, [initialValue]);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    const mappedValue = Object.keys(valueToOptionMap).find((key) => valueToOptionMap[key] === value) || 'NONE';
    onValueChange(mappedValue);
  };

  return (
    <Select icon={<ReplayRoundedIcon />} label='반복' selectId='schedule-repeat' selectedValue={valueToOptionMap[selectedValue] || '없음'} onValueChange={handleSelect}>
      <TextDropdown options={options} handleSelect={handleSelect} />
    </Select>
  );
};

export default RepeatSelect;
