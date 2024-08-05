import instance from '../interceptors';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { IScheduleAddFormData } from '@/app/_types';

export const usePostScheduleAPI = () => {
  const router = useRouter();
  const postScheduleFormData = (data: IScheduleAddFormData) => {
    return instance.post('/api/schedules', data);
  };

  return useMutation(postScheduleFormData, {
    onSuccess: (res) => {
      const resData = res.data.data;
      if (resData) {
        alert('스케줄이 생성되었습니다.');
      } else {
        console.error('스케줄 생성 실패');
      }
    },
    onError: (error) => {
      console.error('스케줄 생성 실패:', error);
    },
  });
};
