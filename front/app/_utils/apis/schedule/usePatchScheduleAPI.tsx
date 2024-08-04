import instance from '../interceptors';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import { IScheduleAddFormData } from '@/app/_types';

export const usePatchSingleScheduleAPI = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  //repeatId 없으면 단일 스케줄 -> 단일 스케줄로 수정 (2-3)
  //repeatId 있으면 반복 스케줄 -> 단일 스케줄로 수정 (2-6)

  //2-3. 반복되지 않는 단일 스케줄 수정
  //scheduleType, scheduleDate, scheduleTime, mates, repeatType, alertType, memo 항목 변경 가능
  //2-6. 반복 스케줄 중 해당 스케줄만 수정 -
  //scheduleType, scheduleDate, scheduleTime, mates, repeatType, alertType, memo 항목 변경 가능

  const patchScheduleFormData = (scheduleId: number, data: IScheduleAddFormData) => {
    return instance.patch(`/api/schedules/${scheduleId}?all=false`, data);
  };

  return useMutation(({ scheduleId, data }: { scheduleId: number; data: IScheduleAddFormData }) => patchScheduleFormData(scheduleId, data), {
    onSuccess: (res, { scheduleId }) => {
      const resData = res.data.data;
      console.log('resData:', resData);

      if (resData) {
        // router.push('/schedule');
        queryClient.invalidateQueries(['getSchedule', scheduleId]);
        alert('해당 스케줄이 수정되었습니다.');
      } else {
        console.error('스케줄 수정 실패');
      }
    },
    onError: (error) => {
      console.error('스케줄 수정 실패:', error);
    },
  });
};

// 2-4. 반복 스케줄 수정 (이후 스케줄도 변경/repeatId 수정하지 않은 경우)
// 2-5 반복 스케줄 수정 (이후 스케줄도 변경/repeatId 새로 생기는 경우)

export const usePatchRepeatMaintainScheduleAPI = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const patchScheduleFormData = (scheduleId: number, data: IScheduleAddFormData) => {
    return instance.patch(`/api/schedules/${scheduleId}?all=true`, data);
  };

  return useMutation(({ scheduleId, data }: { scheduleId: number; data: IScheduleAddFormData }) => patchScheduleFormData(scheduleId, data), {
    onSuccess: (res, { scheduleId }) => {
      queryClient.invalidateQueries(['getSchedule', scheduleId]);
      alert('반복 스케줄이 수정되었습니다.');
    },
    onError: (error) => {
      console.error('반복 스케줄 수정 실패:', error);
    },
  });
};
