'use client';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import Calendar from '@/app/components/schedule/FullCalendar';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import ScheduleAddForm from './components/ScheduleAddForm';

const page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const onAddBtnClick = () => {
    setIsOpen(true);
  };

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // console.log('날짜선택', selectedDate);
  };

  return (
    <>
      <TopNavigation />
      <Wrapper>
        <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
        <AddBtnWrapper onClick={onAddBtnClick}>
          <Image src='/svgs/add_circle.svg' alt='add_circle' width={50} height={50} />
        </AddBtnWrapper>
      </Wrapper>
      <ScheduleAddForm isOpen={isOpen} onToggle={onToggle} selectedDateFromCalender={selectedDate} />
      <BottomNavigation />
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  height: 748px;
  width: 390px;
  justify-content: center;
  top: 0;
  margin: 7.5rem auto;
`;

const AddBtnWrapper = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 50%;
  bottom: -25px;
  justify-content: center;
  align-items: center;
  left: 166px;
  cursor: pointer;
`;

export default page;
