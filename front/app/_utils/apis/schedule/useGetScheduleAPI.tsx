import instance from '../interceptors';
import { useQuery } from 'react-query';
import { IScheduleAddFormData } from '@/app/_types';

export const useGetScheduleAPI = (scheduleId: number | undefined) => {
  const getSchedule = async () => {
    try {
      const response = await instance.get(`/api/schedules/${scheduleId}`);
      return response.data.data;
    } catch (error) {
      throw new Error('일정 가져오기 실패: ' + error);
    }
  };

  return useQuery(['getSchedule', scheduleId], getSchedule, {
    onSuccess: (data) => {
      console.log('스케줄 단일 데이터:', data);
    },
    onError: (error) => {
      console.error('스케줄 가져오기 실패:', error);
    },
  });
};
