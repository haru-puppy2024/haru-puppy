import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import instance from './interceptors';
import { IDogProfile } from '@/app/_types/user/Dog';

// API 요청 함수 수정 (Update Profile)
const updateDogProfileRequest = async ({ accessToken, formData }: { accessToken: string | null; formData: IDogProfile }) => {
  const response = await instance.patch(
    '/api/dogs',
    {
      ...formData,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};

// useMutation 사용하여 프로필 업데이트 처리
export const updateDogProfileAPI = ({ accessToken, formData }: { accessToken: string | null; formData: IDogProfile }) => {
  const router = useRouter();

  return useMutation(() => updateDogProfileRequest({ accessToken, formData }), {
    onSuccess: () => {
      localStorage.setItem('DogInfo', JSON.stringify(formData));
      router.push('/');
    },
    onError: (error) => {
      console.error('프로필 업데이트 에러:', error);
    },
  });
};
