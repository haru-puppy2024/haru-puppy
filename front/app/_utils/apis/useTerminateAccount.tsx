import { useMutation } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '@/app/constants/api';
import instance from './interceptors';

// 회원 탈퇴 요청을 보내는 함수
const terminateAccountRequest = async ({ accessToken }: { accessToken: string | null }) => {
    const response = await instance.post(`/api/users/withdraw`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log('회원탈퇴 성공', response.data)
    return response.data;
};

// useMutation을 사용하여 회원 탈퇴 처리를 하는 custom hook
export const useTerminateAccount = () => {
    const router = useRouter();

    return useMutation(terminateAccountRequest, {
        onSuccess: () => {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            router.push('/auth/login');
        },
        onError: (error) => {
            console.error('회원 탈퇴 에러:', error);
        },
    });
};