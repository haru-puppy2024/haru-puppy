import { useState, useEffect } from 'react';
import Select from './Select';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import TextDropdown from './TextDropdown';

interface INotiSelectProps {
  onValueChange: (value: string) => void;
  initialValue?: string;
}

const NotiSelect = ({ onValueChange, initialValue = '' }: INotiSelectProps) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const optionsMap = [
    { display: '없음', value: 'NONE' },
    { display: '정각', value: 'ON_TIME' },
    { display: '5분 전', value: 'FIVE_MINUTES' },
    { display: '30분 전', value: 'THIRTY_MINUTES' },
    { display: '1시간 전', value: 'ONE_HOUR' },
  ];

  const displayOptions = optionsMap.map((option) => option.display);

  useEffect(() => {
    if (initialValue) {
      const initialOption = optionsMap.find((option) => option.value === initialValue);
      if (initialOption) {
        setSelectedValue(initialOption.display);
      }
    }
  }, [initialValue]);

  const handleSelect = (displayValue: string) => {
    setSelectedValue(displayValue);
    const selectedOption = optionsMap.find((option) => option.display === displayValue);
    if (selectedOption) {
      onValueChange(selectedOption.value);
    }
  };

  return (
    <Select
      icon={<NotificationsNoneRoundedIcon />}
      label='알림'
      selectId='schedule-noti'
      selectedValue={selectedValue}
      onValueChange={handleSelect}
    >
      <TextDropdown options={displayOptions} handleSelect={handleSelect} />
    </Select>
  );
};

export default NotiSelect;
