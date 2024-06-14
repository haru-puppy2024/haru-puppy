import instance from '../interceptors';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import { IScheduleAddFormData } from '@/app/_types';

export const usePatchScheduleAPI = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
        console.log('스케줄 수정 성공!:', resData);
      } else {
        console.error('스케줄 수정 실패');
      }
    },
    onError: (error) => {
      console.error('스케줄 생성 실패:', error);
    },
  });
};
