import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

export enum DateSelectLabel {
  Birthday = '생일',
  ScheduleDay = '날짜',
}

interface IDateSelectProps {
  onValueChange: (date: Date) => void;
  label?: DateSelectLabel;
  isRequired?: boolean;
  initialDate?: Date;
}

const DateSelect = ({ onValueChange, label, isRequired, initialDate }: IDateSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const width = label === DateSelectLabel.Birthday ? '340px' : '300px';

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onValueChange(date);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof Node) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    setSelectedDate(initialDate || new Date());
  }, [initialDate]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DateSelectWrap ref={dropdownRef} width={width}>
      <label htmlFor='schedule-date'>
        <span>
          <CalendarMonthRoundedIcon />
        </span>
        {label}
      </label>
      <div onClick={() => setIsOpen(!isOpen)}>
        {selectedDate.toLocaleDateString()}
        <Image src='/svgs/cover-box.svg' alt='드롭다운 열기' width={20} height={20} />
      </div>
      <DateDropdownWrap>{isOpen && <StyledDatePicker selected={selectedDate} onChange={handleDateSelect} inline className='react-datepicker-custom-b' />}</DateDropdownWrap>
    </DateSelectWrap>
  );
};

const DateSelectWrap = styled.div<{ size?: string; width: string }>`
  position: relative;
  margin: 0 auto;
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  cursor: pointer;

  & > label {
    font-size: 14px;
    font-weight: ${({ theme }) => theme.typo.regular};
    & > span {
      margin-right: 10px;
      vertical-align: middle;
    }
  }

  & > div {
    position: relative;
    line-height: 40px;
    margin-top: 10px;
    text-align: center;
    font-size: 14px;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    & > img {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
`;

const DateDropdownWrap = styled.span`
  position: absolute;
  top: 100%;
  z-index: 1000;
  width: 320px;
  margin-top: 10px;
  text-align: center;
`;
const StyledDatePicker = styled(DatePicker)`
  &.react-datepicker-custom-b {
    .react-datepicker {
      border: 1px solid #dcdde1;
      border-radius: 20px;
    }

    .react-datepicker__header {
      background-color: #fcfcfc;
      color: white;
      border-bottom: none;
      border-radius: 20px;
    }

    .react-datepicker__day--selected {
      background-color: #fa9e52;
      color: white;
    }

    .react-datepicker__day--selected,
    .react-datepicker__day--selected:hover {
      border-radius: 50%;
      border: none;
    }
  }
`;

export default DateSelect;
