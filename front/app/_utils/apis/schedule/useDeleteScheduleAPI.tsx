import instance from '../interceptors';
import { useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
interface DeleteScheduleParams {
  scheduleId: number | undefined;
  all: boolean;
}

export const useDeleteScheduleAPI = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteSchedule = async ({ scheduleId, all }: DeleteScheduleParams) => {
    const { data } = await instance.delete(`/api/schedules/${scheduleId}?all=${all}`);
    return data;
  };

  return useMutation(deleteSchedule, {
    onSuccess: (data, scheduleId) => {
      console.log('스케줄 삭제 성공!:', data);

      queryClient.invalidateQueries(['getSchedule', scheduleId]);
    },
    onError: (error) => {
      console.error('스케줄 삭제 실패:', error);
    },
  });
};
