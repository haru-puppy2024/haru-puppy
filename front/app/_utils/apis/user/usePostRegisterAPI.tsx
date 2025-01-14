import instance from '../interceptors';
import { useMutation } from 'react-query';
import { useCookies } from 'react-cookie';
import { LOCAL_STORAGE_KEYS } from '@/app/constants/api';
import { useRecoilState } from 'recoil';
import { userState } from '@/app/_states/userState';
import { dogState } from '@/app/_states/dogState';
import { useRouter } from 'next/navigation';
import { IRegisterData, IUser } from '@/app/_types';

export const usePostRegisterAPI = () => {
  const [, setUser] = useRecoilState(userState);
  const [, setDog] = useRecoilState(dogState);
  const [cookies, setCookie] = useCookies(['access_token']);
  const router = useRouter();
  const postRegisterData = (data: IRegisterData) => {
    return instance.post('/api/users/register', data);
  };

  return useMutation(postRegisterData, {
    onSuccess: (res) => {
      const resData = res.data.data;
      const accessToken = resData.token.accessToken;
      setCookie('access_token', accessToken, {
        path: '/',
        sameSite: 'strict',
      });
      if (resData) {
        setUser(resData.userResponse);
        setDog(resData.dogResponse);
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

export const usePostInviteRegisterAPI = () => {
  const router = useRouter();
  const [, setUser] = useRecoilState(userState);
  const [, setDog] = useRecoilState(dogState);
  const [cookies, setCookie] = useCookies(['access_token']);
  const postInviteRegisterData = async (data: { requestData: IUser; homeId: string }) => {
    const { requestData, homeId } = data;
    return instance.post(`/api/users/invitation/${homeId}`, requestData);
  };

  return useMutation(postInviteRegisterData, {
    onSuccess: (res) => {
      const resData = res.data.data;
      const accessToken = resData.token.accessToken;
      setCookie('access_token', accessToken, {
        path: '/',
        sameSite: 'strict',
      });
      if (resData) {
        setUser(resData.userResponse);
        setDog(resData.dogResponse);
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
