import instance from '../interceptors';
import { useMutation } from 'react-query';
import { LOCAL_STORAGE_KEYS } from '@/app/constants/api';
import { useRecoilState } from 'recoil';
import { userState } from '@/app/_states/userState';
import { IRequestData } from '@/app/_types/user/RegisterData';
import { useRouter } from 'next/navigation';
import { IUser } from '@/app/_types/user/User';

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
        console.log('가입 성공:', resData.userResponse);
      } else {
        console.error('accessToken이 응답에 포함되지 않았습니다.');
      }
    },
    onError: (error) => {
      console.error('가입 실패:', error);
    },
  });
};

export const usePostInviteRegisterAPI = () => {
  const router = useRouter();
  const [, setUser] = useRecoilState(userState);
  const postInviteRegisterData = async (data: { requestData: IUser; homeId: string }) => {
    const { requestData, homeId } = data;
    return instance.post(`/api/users/invitation/${homeId}`, requestData);
  };

  return useMutation(postInviteRegisterData, {
    onSuccess: (res) => {
      const resData = res.data.data;
      const accessToken = resData.token.accessToken;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (setUser) {
        setUser(resData.userResponse);
      }

      if (accessToken) {
        router.push('/');
        console.log('가입 성공:', resData.userResponse);
      } else {
        console.error('accessToken이 응답에 포함되지 않았습니다.');
      }
    },
    onError: (error) => {
      console.error('가입 실패:', error);
    },
  });
};
