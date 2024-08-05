import instance from '../interceptors';
import { useMutation, useQueryClient } from 'react-query';

interface DeleteScheduleParams {
  scheduleId: number | undefined;
  all: boolean;
}

export const useDeleteScheduleAPI = () => {
  const queryClient = useQueryClient();

  const deleteSchedule = async ({ scheduleId, all }: DeleteScheduleParams) => {
    const { data } = await instance.delete(`/api/schedules/${scheduleId}?all=${all}`);
    return data;
  };

  return useMutation(deleteSchedule, {
    onSuccess: (data, variables) => {
      const { scheduleId, all } = variables;
      queryClient.invalidateQueries(['getSchedule', scheduleId]);

      if (all === true) {
        alert('반복 스케줄이 삭제되었습니다.');
      } else if (all === false) {
        alert('해당 스케줄이 삭제되었습니다.');
      }

      console.log(data);
    },
    onError: (error) => {
      console.error('스케줄 삭제 실패:', error);
    },
  });
};
