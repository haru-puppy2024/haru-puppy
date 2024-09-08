import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { userState } from '@/app/_states/userState';
import { BACKEND_REDIRECT_URL, LOCAL_STORAGE_KEYS } from '@/app/constants/api';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export const fetcher = async (code: string | null) => {
  if (!code) return null;
  const res = await axios.get(`${BACKEND_REDIRECT_URL}?code=${code}`);
  return res.data.data;
};

export const useLoginQuery = (code: string | null) => {
  const router = useRouter();
  const [, setUser] = useRecoilState(userState);
  const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);

  return useQuery(['login'], () => fetcher(code), {
    enabled: !!code,
    onSuccess: (responseData) => {
      if (responseData.response.isAlreadyRegistered === false) {
        const email = responseData.response.email;
        router.push(`/auth/welcome/?email=${email}`);
      } else {
        const accessToken = responseData.accessToken;
        const refreshToken = responseData.refreshToken;

        // 쿠키에 토큰 저장
        setCookie('access_token', accessToken, {
          path: '/',
          //   secure: true,
          sameSite: 'strict',
        });
        setCookie('refresh_token', refreshToken, {
          path: '/',
          //   secure: true,
          sameSite: 'strict',
        });

        if (setUser) {
          setUser(responseData.response.registeredUser);
        }
        router.push('/');
      }
    },
    onError: (error) => {
      console.error('로그인 중 에러가 발생하였습니다.');
    },
  });
};

export const useCode = () => {
  const params = useSearchParams();
  return params?.get('code') || null;
};
