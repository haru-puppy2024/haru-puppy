'use client';

import { getYear, getMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import TodoCard from '../card/TodoCard';
import { ko } from 'date-fns/locale';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import WeekCalendar from './WeekCalendar';
import { IScheduleItem } from '@/app/_types';
import axios from 'axios';
import instance from '@/app/_utils/apis/interceptors';

export interface ScheduleResponse {
  schedule: IScheduleItem[];
}

interface ICalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const currentYear = getYear(new Date());
const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const Calendar = ({ selectedDate, onDateChange }: ICalendarProps) => {
  const [date, setDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<IScheduleItem[]>([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState<IScheduleItem[]>([]);
  const [markedDates, setMarkedDates] = useState<Date[]>([new Date('2023-12-01'), new Date('2023-12-05'), new Date('2023-12-10')]);
  const month = getMonth(date) + 1;
  const year = getYear(date);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const response = await instance.get(`/api/schedules?year=${year}&month=${month}`);
        const data: IScheduleItem[] = response.data.data;
        console.log('Month 스케줄 패칭', data);

        if (data) {
          setScheduleData(data);
          const dateObjects = data?.map((item: IScheduleItem) => new Date(item.scheduleDate || ''));
          setMarkedDates(dateObjects);
        } else {
          setScheduleData([]);
        }
      } catch (error) {
        // console.error('Month 스케줄 페칭 에러', error);
        setScheduleData([]);
      }
    };

    fetchScheduleData();
  }, [date]);

  const renderDayContents = (dayOfMonth: number, date?: Date | null): React.ReactNode => {
    if (!date) return null;

    const formattedDate = date.toISOString().split('T')[0];
    const isDateMarked = markedDates.some((markedDate) => formattedDate === markedDate.toISOString().split('T')[0]);

    return (
      <div>
        {dayOfMonth}
        {isDateMarked && <Dot />}
      </div>
    );
  };

  const handleDateClick = async (clickedDate: Date) => {
    try {
      const year = getYear(clickedDate);
      const month = getMonth(clickedDate) + 1;
      const day = clickedDate.getDate();
      const response = await instance.get(`/api/schedules?year=${year}&month=${month}&day=${day}`);
      const DayData = response.data.data;

      setSelectedDateTasks(DayData);
      setDate(clickedDate);
      onDateChange(clickedDate);
    } catch (error) {
      console.error('특정 날짜 스케줄 목록 조회 에러', error);
    }
  };

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <Wrapper>
        {showDatePicker ? (
          <>
            <DatePicker
              renderDayContents={renderDayContents}
              locale={ko}
              selected={date}
              onChange={(newDate: Date) => {
                setDate(newDate);
                handleDateClick(newDate);
              }}
              inline
              dayClassName={(d) => (d.getDate() === date!.getDate() ? 'selectedDay' : 'unselectedDay')}
              calendarClassName={'calenderWrapper'}
              closeOnScroll={true}
              renderCustomHeader={({ date, changeYear, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                <CustomHeaderContainer>
                  <Button type='button' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                    <ChevronLeftIcon />
                  </Button>
                  <div>
                    <select value={getYear(date)} onChange={({ target: { value } }) => changeYear(+value)}>
                      {YEARS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <span>{MONTHS[getMonth(date)]}</span>
                  </div>

                  <Button type='button' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                    <ChevronRightIcon />
                  </Button>
                </CustomHeaderContainer>
              )}
            />
            <ArrowDropUpIcon onClick={() => setShowDatePicker(!showDatePicker)} fontSize='large' color='action' />
          </>
        ) : (
          <>
            <WeekCalendar date={date} handleDateClick={handleDateClick} />
            <ArrowDropDownIcon onClick={() => setShowDatePicker(!showDatePicker)} fontSize='large' color='action' />
          </>
        )}
      </Wrapper>
      <TodoCard todoList={selectedDateTasks} />
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 70px;
  background-color: #ffffff;
`;

const Dot = styled.div`
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background-color: #e15f41;
  border-radius: 50%;
`;

const CustomHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  height: 100%;
  margin-top: 8px;
  padding: 5px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;

    & > * {
      margin-right: auto;
      margin-left: auto;
    }

    & > span {
      color: #5b5b5b;
      font-size: 20px;
      font-weight: 400;
    }

    & > select {
      background-color: #ffffff;
      color: #5b5b5b;
      border: none;
      margin-right: 12px;
      font-size: 20px;
      font-weight: 400;
      padding-right: 5px;
      cursor: pointer;
    }
  }
`;

const Button = styled.button`
  width: 34px;
  height: 34px;
  padding: 5px;
  border-radius: 50%;
  svg {
    color: ${({ theme }) => theme.colors.main};
  }
  &:hover {
    background-color: rgba(#ffffff, 0.08);
  }
  &:disabled {
    cursor: default;
    background-color: ${({ theme }) => theme.colors.main};
  }
`;

export default Calendar;
