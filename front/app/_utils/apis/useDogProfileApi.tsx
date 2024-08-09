import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import instance from './interceptors';
import { IDogProfile } from '@/app/_types/user/Dog';

interface UpdateDogProfileParams {
  accessToken: string | null;
  formData: IDogProfile;
}

export const useUpdateDogProfileAPI = () => {
  return useMutation<IDogProfile, Error, UpdateDogProfileParams>(
    async ({ accessToken, formData }) => {
      const response = await instance.patch(
        '/api/dogs',
        { ...formData },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    },
  );
};
