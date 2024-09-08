'use client';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import Calendar from '@/app/components/schedule/FullCalendar';
import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';
import ScheduleAddForm from './components/ScheduleAddForm';
import { useGetTodoScheduleAPI } from '@/app/_utils/apis';
import { getYear, getMonth } from 'date-fns';
import { overlay } from 'overlay-kit';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);

  const year = getYear(selectedDate);
  const month = getMonth(selectedDate) + 1;
  const day = selectedDate.getDate();

  const { data: monthData, refetch: refetchMonthData } = useGetTodoScheduleAPI(
    year,
    month,
  );
  const { data: dayData, refetch: refetchDayData } = useGetTodoScheduleAPI(
    year,
    month,
    day,
  );

  const refetchTodos = () => {
    refetchMonthData();
    refetchDayData();
  };

  const openScheduleForm = (scheduleId: number | null) => {
    setSelectedScheduleId(scheduleId);
    overlay.open(({ isOpen, close }) => {
      return (
        <OverlayBackground data-open={isOpen}>
          <StyledScheduleAddForm
            selectedDateFromCalender={selectedDate}
            scheduleId={scheduleId !== null ? scheduleId : undefined}
            refetchTodos={refetchTodos}
            close={close}
          />
        </OverlayBackground>
      );
    });
  };

  const onAddBtnClick = () => openScheduleForm(null);

  const handleDateChange = (date: Date) => setSelectedDate(date);

  const handleTodoClick = (scheduleId: number) => openScheduleForm(scheduleId);

  return (
    <>
      <TopNavigation />
      <Wrapper>
        <Calendar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          onTodoClick={handleTodoClick}
          monthData={monthData}
          dayData={dayData}
          refetchTodos={refetchTodos}
        />
        <AddBtnWrapper onClick={onAddBtnClick}>
          <Image src='/svgs/add_circle.svg' alt='add_circle' width={50} height={50} />
        </AddBtnWrapper>
      </Wrapper>
      <BottomNavigation />
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: 30px;
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
  bottom: -30px;
  justify-content: center;
  align-items: center;
  left: 166px;
  cursor: pointer;
`;

const OverlayBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;

  opacity: 0;
  display: none;
  &[data-open='true'] {
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }
`;

const StyledScheduleAddForm = styled(ScheduleAddForm)`
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  max-width: 390px;
  transform: translateX(-50%) translateY(100%);
  transition: transform 0.3s ease-out;

  &[data-open='true'] {
    transform: translateX(-50%) translateY(0);
  }
`;

export default SchedulePage;
