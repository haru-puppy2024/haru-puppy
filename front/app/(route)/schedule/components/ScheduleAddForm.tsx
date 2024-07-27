'use client';

import { mateState } from '@/app/_states/mateState';
import { IScheduleAddFormData } from '@/app/_types';
import { useDeleteScheduleAPI, useGetScheduleAPI, usePatchRepeatMaintainScheduleAPI, usePatchSingleScheduleAPI, usePostScheduleAPI } from '@/app/_utils/apis';
import { formatDateToHM, formatDateToYMD, formatTimeToHM, parseDateToYMD } from '@/app/_utils/formatDate';
import Button from '@/app/components/button/Button';
import MemoTextArea from '@/app/components/input/MemoTextArea';
import { RadioModal } from '@/app/components/modal/RadioModal';
import DateSelect, { DateSelectLabel } from '@/app/components/profile/DateSelect';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import MateSelect from './MateSelect';
import NotiSelect from './NotiSelect';
import RepeatSelect from './RepeatSelect';
import ScheduleTypeSelect from './ScheduleTypeSelect';
import TimeSelect from './TimeSelect';

export interface IScheduleAddFormProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedDateFromCalender: Date;
  scheduleId?: number;
}

const ScheduleAddForm = ({ isOpen, onToggle, selectedDateFromCalender, scheduleId }: IScheduleAddFormProps) => {
  const { mutate: postScheduleAPI } = usePostScheduleAPI();
  const { mutate: patchScheduleAPI } = usePatchSingleScheduleAPI();
  const { mutate: patchRepeatMaintainScheduleAPI } = usePatchRepeatMaintainScheduleAPI();
  const { mutate: deleteScheduleAPI } = useDeleteScheduleAPI();
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

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (scheduleId && loadedScheduleData && !isLoading && !isError) {
      const formattedMates = loadedScheduleData.mates.map((mateId: number) => ({
        userId: mateId,
      }));
      setFormData({
        scheduleType: loadedScheduleData.scheduleType || 'WALK',
        mates: formattedMates,
        scheduleDate: parseDateToYMD(loadedScheduleData.scheduleDate),
        scheduleTime: formatTimeToHM(loadedScheduleData.scheduleTime) || '',
        repeatType: loadedScheduleData.repeatType || 'NONE',
        alertType: loadedScheduleData.alertType || 'NONE',
        memo: loadedScheduleData.memo || '',
      });
      if (loadedScheduleData.repeatId === null) {
        console.log('repeatId가 null이야 없어없어');
      } else {
        console.log('repeatId 있는 스케줄이다!', loadedScheduleData.repeatId);
      }
    } else if (!scheduleId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        scheduleDate: formatDateToYMD(selectedDateFromCalender),
      }));
    }
  }, [scheduleId, loadedScheduleData, isLoading, isError, selectedDateFromCalender]);

  const initialDate = scheduleId && loadedScheduleData ? parseDateToYMD(loadedScheduleData.scheduleDate) : formatDateToYMD(selectedDateFromCalender);

  //   console.log('selectedDateFromCalender:', selectedDateFromCalender);
  //   console.log('initialDate:', initialDate);
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
    if (loadedScheduleData.repeatId !== null) {
      setIsDeleteModalOpen(true);
    } else {
      deleteScheduleAPI({ scheduleId: scheduleId!, all: true });
      onToggle();
      resetFormData();
    }
  };

  const handleSave = () => {
    console.log('저장');
    if (scheduleId !== undefined) {
      console.log('수정');
      const isRepeat = formData.repeatType !== 'NONE' || loadedScheduleData.repeatType !== 'NONE';
      if (isRepeat) {
        console.log('반복 수정');
        setIsUpdateModalOpen(true);
      } else {
        console.log('단건 수정');
        patchScheduleAPI(
          { scheduleId, data: formData },
          {
            onSuccess: () => {
              onToggle();
            },
          },
        );
      }
    } else {
      postScheduleAPI(formData, {
        onSuccess: () => {
          onToggle();
          resetFormData();
        },
      });
    }
  };

  const resetFormData = () => {
    setFormData({
      scheduleType: 'WALK',
      mates: [],
      scheduleDate: formatDateToYMD(selectedDateFromCalender),
      scheduleTime: '',
      repeatType: 'NONE',
      alertType: 'NONE',
      memo: '',
    });
  };

  return (
    <>
      {isOpen && <Overlay onClick={onToggle} />}
      {isUpdateModalOpen && (
        <RadioModal
          title='반복 스케줄 수정'
          optionList={[
            { key: 'all', label: '이 스케줄만 수정' },
            { key: 'only', label: '반복 스케줄 수정' },
          ]}
          name='selectRepeat'
          onSubmit={(key) => {
            if (scheduleId === undefined) return;
            if (key === 'only') {
              patchScheduleAPI(
                { scheduleId, data: formData },
                {
                  onSuccess: () => {
                    onToggle();
                  },
                },
              );
            }
            if (key === 'all') {
              patchRepeatMaintainScheduleAPI(
                { scheduleId, data: formData },
                {
                  onSuccess: () => {
                    onToggle();
                  },
                },
              );
            }
          }}
          isOpen={isUpdateModalOpen}
          setOpen={setIsUpdateModalOpen}
        />
      )}
      {isDeleteModalOpen && (
        <RadioModal
          title='반복 스케줄 삭제'
          optionList={[
            { key: 'all', label: '반복 스케줄 삭제' },
            { key: 'only', label: '이 스케줄만 삭제' },
          ]}
          name='deleteRepeat'
          onSubmit={(key) => {
            if (scheduleId === undefined) return;
            if (key === 'only') {
              deleteScheduleAPI({ scheduleId, all: false });
            } else if (key === 'all') {
              deleteScheduleAPI({ scheduleId, all: true });
            }
            onToggle();
            resetFormData();
          }}
          isOpen={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
        />
      )}
      <ScheduleAddWrap data-open={isOpen}>
        <FormWrap
          method='POST'
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <ScheduleTypeSelect onValueChange={(value) => handleSelectChange('scheduleType', value)} initialValue={formData.scheduleType} />
          <MateSelect onValueChange={(value) => handleSelectChange('mates', value)} mates={mates} initialSelectedMates={formData.mates} />
          <DateSelect onValueChange={(value) => handleSelectChange('scheduleDate', value)} label={DateSelectLabel.ScheduleDay} isRequired={true} initialDate={initialDate} />
          <TimeSelect onValueChange={(value) => handleSelectChange('scheduleTime', value)} initialValue={formData.scheduleTime} />
          <RepeatSelect onValueChange={(value) => handleSelectChange('repeatType', value)} initialValue={formData.repeatType} />
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

const ScheduleAddWrap = styled.main`
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
  transform: translateX(-50%) translateY(100%);
  &[data-open='true'] {
    transform: translateX(-50%);
  }
  z-index: 1000;

  @media (max-height: 740px) {
    padding: 20px 0 14px;
  }
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
