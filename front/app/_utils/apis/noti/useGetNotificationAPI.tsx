import { INotification } from '@/app/_types/noti/Noti';
import instance from '../interceptors';
import { useMutation, useQuery, useQueryClient } from 'react-query';

// 전체 알림을 가져오는 훅
export const useGetAllNotifications = () => {
  const getAllNotifications = async (): Promise<INotification[]> => {
    try {
      const response = await instance.get('/api/notification');

      return response.data.data;
    } catch (error) {
      throw new Error('전체 알림 가져오기 실패: ' + error);
    }
  };

  return useQuery<INotification[], Error>('getAllNotifications', getAllNotifications);
};

// 단일 알림을 가져오는 훅
export const useGetSingleNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<INotification, Error, number>(
    async (notificationId) => {
      const response = await instance.get(`/api/notification/${notificationId}`);
      return response.data.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('getAllNotifications');
        console.log('서버에서 갖고온 단일 알림 데이터:', data);
      },
      onError: (error) => {
        console.error('서버에서 단일 알림 가져오기 실패:', error);
      },
    },
  );
};
