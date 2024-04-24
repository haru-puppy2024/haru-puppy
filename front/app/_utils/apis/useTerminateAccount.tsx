import { useMutation } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '@/app/constants/api';

// 회원 탈퇴 요청을 보내는 함수
const terminateAccountRequest = async ({ userId, accessToken }: { userId: string; accessToken: string | null }) => {
    const response = await axios.delete(`/api/users/${userId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
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