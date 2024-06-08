import { useEffect, useState } from 'react';
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
import { IMate, IScheduleAddFormData } from '@/app/_types';
import { usePostScheduleAPI, useGetScheduleAPI } from '@/app/_utils/apis';

export interface IScheduleAddFormProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedDate: Date;
  scheduleId?: number;
}

export const dummyMatesData: IMate[] = [
  {
    userId: 1,
    user_img: '',
    nickname: '송이엄마',
    role: 'MOM',
  },
  {
    userId: 2,
    user_img: '',
    nickname: '송이아빠',
    role: 'DAD',
  },
  {
    userId: 3,
    user_img: '',
    nickname: '송이언니',
    role: 'UNNIE',
  },
];

const ScheduleAddForm = ({ isOpen, onToggle, selectedDate, scheduleId }: IScheduleAddFormProps) => {
  const { mutate: postScheduleAPI } = usePostScheduleAPI();
  const { data: loadedScheduleData, isLoading, isError } = useGetScheduleAPI(scheduleId);

  const [formData, setFormData] = useState<IScheduleAddFormData>({
    scheduleType: 'WALK',
    mates: [],
    scheduleDate: dayjs(selectedDate).format('YYYY-MM-DD'),
    scheduleTime: '',
    repeatType: 'NONE',
    alertType: 'NONE',
    memo: '',
  });

  useEffect(() => {
    if (scheduleId && loadedScheduleData && !isLoading && !isError) {
      setFormData({
        scheduleType: loadedScheduleData.scheduleType || 'WALK',
        mates: loadedScheduleData.mates || [],
        scheduleDate: dayjs(loadedScheduleData.scheduleDate).format('YYYY-MM-DD'),
        scheduleTime: loadedScheduleData.scheduleTime || '',
        repeatType: loadedScheduleData.repeatType || 'NONE',
        alertType: loadedScheduleData.alertType || 'NONE',
        memo: loadedScheduleData.memo || '',
      });
    } else if (!scheduleId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        scheduleDate: dayjs(selectedDate).format('YYYY-MM-DD'),
      }));
    }
  }, [scheduleId, loadedScheduleData, isLoading, isError, selectedDate]);

  const initialDate = scheduleId && loadedScheduleData ? new Date(loadedScheduleData.scheduleDate) : selectedDate;

  console.log('formData:', formData);

  const handleSelectChange = (name: string, value: any) => {
    let formattedValue = value;

    if (name === 'scheduleDate' && value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }

    if (name === 'scheduleTime' && value instanceof Date) {
      formattedValue = dayjs(value).format('HH:mm');
    }
    if (name === 'mates' && value instanceof Array) {
      formattedValue = value;
    }

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);
  };

  const handleDelete = () => {
    console.log('삭제');
  };

  const handleSave = () => {
    console.log('저장');
    postScheduleAPI(formData);
  };

  return (
    <>
      {isOpen && <Overlay onClick={onToggle} />}
      <ScheduleAddWrap isOpen={isOpen}>
        <FormWrap method='POST'>
          <ScheduleTypeSelect onValueChange={(value) => handleSelectChange('scheduleType', value)} initialValue={formData.scheduleType} />
          <MateSelect onValueChange={(value) => handleSelectChange('mates', value)} mates={dummyMatesData} initialSelectedMates={formData.mates} />
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
