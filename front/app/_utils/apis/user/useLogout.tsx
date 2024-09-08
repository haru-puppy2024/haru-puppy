import { useRouter } from 'next/navigation';
import instance from '../interceptors';
import { useMutation } from 'react-query';
import { useCookies } from 'react-cookie';

// 회원 탈퇴 요청을 보내는 함수
const logoutRequest = async ({ accessToken }: { accessToken: string | null }) => {
  const response = await instance.post(`/auth/logout`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};

// useMutation을 사용하여 회원 탈퇴 처리를 하는 custom hook
export const useLogout = () => {
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies([
    'access_token',
    'refresh_token',
  ]);

  return useMutation(logoutRequest, {
    onSuccess: () => {
      removeCookie('access_token', { path: '/' });
      removeCookie('refresh_token', { path: '/' });
      localStorage.removeItem('userState');
      localStorage.removeItem('dogState');
      localStorage.removeItem('mateState');
      router.push('/auth/login');
    },
    onError: (error) => {
      console.error('로그아웃 에러:', error);
    },
  });
};
