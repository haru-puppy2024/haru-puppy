import instance from '../interceptors';
import { useQuery } from 'react-query';

export const useGetScheduleAPI = (scheduleId: number | undefined) => {
  const getSchedule = async () => {
    if (!scheduleId) {
      throw new Error('scheduleId 없음');
    }
    try {
      const response = await instance.get(`/api/schedules/${scheduleId}`);
      return response.data.data;
    } catch (error) {
      throw new Error('일정 가져오기 실패: ' + error);
    }
  };

  return useQuery(['getSchedule', scheduleId], getSchedule, {
    enabled: !!scheduleId,
    onSuccess: (data) => {
      console.log('서버에서 갖고온 스케줄 단일 데이터:', data);
    },
    onError: (error) => {
      console.error('서버에서 단일 스케줄 가져오기 실패:', error);
    },
  });
};
