'use client';

import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { mateState } from '@/app/_states/mateState';
import Image from 'next/image';
import dayjs from 'dayjs';
import Button from '@/app/components/button/Button';
import styled from 'styled-components';
import MateSelect from './MateSelect';
import MemoTextArea from '@/app/components/input/MemoTextArea';
import ScheduleTypeSelect from './ScheduleTypeSelect';
import DateSelect, { DateSelectLabel } from '@/app/components/profile/DateSelect';
import TimeSelect from './TimeSelect';
import RepeatSelect from './RepeatSelect';
import NotiSelect from './NotiSelect';
import { IScheduleAddFormData } from '@/app/_types';
import { usePostScheduleAPI, useGetScheduleAPI, usePatchScheduleAPI } from '@/app/_utils/apis';
import { formatDateToYMD, formatDateToHM, parseDateToYMD } from '@/app/_utils/formatDate';

export interface IScheduleAddFormProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedDateFromCalender: Date;
  scheduleId?: number;
}

const ScheduleAddForm = ({ isOpen, onToggle, selectedDateFromCalender, scheduleId }: IScheduleAddFormProps) => {
  const { mutate: postScheduleAPI } = usePostScheduleAPI();
  const { mutate: patchScheduleAPI } = usePatchScheduleAPI();
  const { data: loadedScheduleData, isLoading, isError } = useGetScheduleAPI(scheduleId);
  const mates = useRecoilValue(mateState);

  const [formData, setFormData] = useState<IScheduleAddFormData>({
    scheduleType: 'WALK',
    mates: [],
    scheduleDate: formatDateToYMD(selectedDateFromCalender),
    scheduleTime: '',
    repeatType: 'NONE',
    alertType: 'NONE',
    memo: '',
  });

  useEffect(() => {
    if (scheduleId && loadedScheduleData && !isLoading && !isError) {
      const formattedMates = loadedScheduleData.mates.map((mateId: number) => ({
        userId: mateId,
      }));
      setFormData({
        scheduleType: loadedScheduleData.scheduleType || 'WALK',
        mates: formattedMates,
        scheduleDate: parseDateToYMD(loadedScheduleData.scheduleDate),
        scheduleTime: loadedScheduleData.scheduleTime || '',
        repeatType: loadedScheduleData.repeatType || 'NONE',
        alertType: loadedScheduleData.alertType || 'NONE',
        memo: loadedScheduleData.memo || '',
      });
    } else if (!scheduleId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        scheduleDate: formatDateToYMD(selectedDateFromCalender),
      }));
    }
  }, [scheduleId, loadedScheduleData, isLoading, isError, selectedDateFromCalender]);

  const initialDate = scheduleId && loadedScheduleData ? parseDateToYMD(loadedScheduleData.scheduleDate) : formatDateToYMD(selectedDateFromCalender);

  console.log('selectedDateFromCalender:', selectedDateFromCalender);
  console.log('initialDate:', initialDate);
  console.log('formData:', formData);

  const handleSelectChange = (name: string, value: any) => {
    let formattedValue = value;

    if (name === 'scheduleDate' && value instanceof Date) {
      formattedValue = formatDateToYMD(value);
    }

    if (name === 'scheduleTime' && value instanceof Date) {
      formattedValue = formatDateToHM(value);
    }
    if (name === 'mates' && value instanceof Array) {
      formattedValue = value;
    }

    const newFormData = {
      ...formData,
      [name]: formattedValue,
    };

    setFormData(newFormData);
  };

  const handleDelete = () => {
    console.log('삭제');
  };

  const handleSave = () => {
    console.log('저장');
    if (scheduleId !== undefined) {
      patchScheduleAPI({ scheduleId, data: formData });
    } else {
      postScheduleAPI(formData);
    }
  };

  return (
    <>
      {isOpen && <Overlay onClick={onToggle} />}
      <ScheduleAddWrap isOpen={isOpen}>
        <FormWrap method='POST'>
          <ScheduleTypeSelect onValueChange={(value) => handleSelectChange('scheduleType', value)} initialValue={formData.scheduleType} />
          <MateSelect onValueChange={(value) => handleSelectChange('mates', value)} mates={mates} initialSelectedMates={formData.mates} />
          <DateSelect onValueChange={(value) => handleSelectChange('scheduleDate', value)} label={DateSelectLabel.ScheduleDay} isRequired={true} initialDate={initialDate} />
          <TimeSelect onValueChange={(value) => handleSelectChange('scheduleTime', value)} initialValue={formData.scheduleTime} />
          <RepeatSelect onValueChange={(value) => handleSelectChange('repeatType', value)} />
          <NotiSelect onValueChange={(value) => handleSelectChange('alertType', value)} />
          <MemoTextArea onValueChange={(value) => handleSelectChange('memo', value)} initialValue={formData.memo} />
          <ButtonGroupWrap>
            <Button onClick={handleDelete} width='135px' height='32px'>
              삭제
            </Button>
            <Button onClick={handleSave} width='135px' height='32px'>
              저장
            </Button>
          </ButtonGroupWrap>
        </FormWrap>
        <CloseButton onClick={onToggle}>
          <Image src='/svgs/close_grey.svg' alt='닫기' width={24} height={24} />
        </CloseButton>
      </ScheduleAddWrap>
    </>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ScheduleAddWrap = styled.main<{ isOpen: boolean }>`
  padding: 37px 0 61px;
  width: 390px;
  height: 620px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border: 1px solid #e6e6e6;
  position: fixed;
  bottom: 0;
  left: 50%;
  right: 50%;
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: transform 0.3s ease-out;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(-50%)' : 'translateX(-50%) translateY(100%)')};
  z-index: 1000;
`;
const FormWrap = styled.form`
  overflow: hideen;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    margin-bottom: 14px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
`;
const ButtonGroupWrap = styled.div`
  margin-top: 30px;
  & button:first-of-type {
    margin-right: 26px;
  }
`;
export default ScheduleAddForm;
