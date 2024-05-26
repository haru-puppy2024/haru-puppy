import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { userState } from '@/app/_states/userState';
import { BACKEND_REDIRECT_URL, LOCAL_STORAGE_KEYS } from '@/app/constants/api';
import axios from 'axios';


export const fetcher = async (code: string | null) => {
    if (!code) return null;
    const res = await axios.get(`${BACKEND_REDIRECT_URL}?code=${code}`);
    return res.data.data;
};

export const useLoginQuery = (code: string | null) => {
    const router = useRouter();
    const [, setUser] = useRecoilState(userState);

    return useQuery(['login'], () => fetcher(code), {
        enabled: !!code,
        onSuccess: (responseData) => {
            if (responseData.response.isAlreadyRegistered === false) {
                const email = responseData.response.email;
                router.push(`/auth/welcome/?email=${email}`);
            } else {
                const accessToken = responseData.accessToken;
                const refreshToken = responseData.refreshToken;

                localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
                if (setUser) {
                    setUser(responseData.response.registeredUser);
                    console.log('Recoil 상태 업데이트: userState =', responseData.response.registeredUser);
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