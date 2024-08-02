import instance from '../interceptors';
import { useMutation, useQueryClient } from 'react-query';

const updateTodoStatus = async ({ scheduleId, newIsActive }: { scheduleId: number; newIsActive: boolean }) => {
  const { data } = await instance.patch(`/api/schedules/${scheduleId}/status?active=${newIsActive}`);
  return data;
};

export const usePatchTodoScheduleAPI = () => {
  const queryClient = useQueryClient();

  return useMutation(updateTodoStatus, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['todos']);
    },
    onError: (error) => {
      console.error('Failed to update todo status:', error);
    },
  });
};
