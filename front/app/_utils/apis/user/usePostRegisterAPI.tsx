import axios from 'axios';
import instance from '../interceptors';
import { useMutation } from 'react-query';
import { LOCAL_STORAGE_KEYS } from '@/app/constants/api';
import { useRecoilState } from 'recoil';
import { userState } from '@/app/_states/userState';
import { IRequestData } from '@/app/_types/user/RegisterData';
import { useRouter } from 'next/navigation';

export const usePostRegisterAPI = () => {
  const [, setUser] = useRecoilState(userState);
  const router = useRouter();

  const postRegisterData = (data: IRequestData) => {
    return instance.post('/api/users/register', data);
  };

  return useMutation(postRegisterData, {
    onSuccess: (res) => {
      const resData = res.data.data;
      const accessToken = resData.token.accessToken;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (setUser) {
        setUser(resData.userResponse);
      }

      if (accessToken) {
        router.push('/');
      } else {
        console.error('accessToken이 응답에 포함되지 않았습니다.');
      }
    },
    onError: (error) => {
      console.error('가입 실패:', error);
    },
  });
};
