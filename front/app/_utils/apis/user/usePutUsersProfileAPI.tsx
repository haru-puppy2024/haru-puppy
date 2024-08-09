import instance from '../interceptors';
import { useMutation } from 'react-query';
import { IUser } from '@/app/_types';
import { AxiosError } from 'axios';

export const usePutUserProfileAPI = () => {
  const updateProfile = async (formData: IUser) => {
    try {
      const response = await instance.put('/api/users/profile', formData);
      const { message, status, ...userInfo } = response.data;
      return userInfo.data;
    } catch (error: any) {
      throw new AxiosError(error.message);
    }
  };

  return useMutation<IUser, AxiosError, IUser>(updateProfile);
};
