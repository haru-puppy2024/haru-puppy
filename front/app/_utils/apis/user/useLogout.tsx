import { useRouter } from "next/router";
import instance from "../interceptors";
import { useMutation } from "react-query";
import { LOCAL_STORAGE_KEYS } from "@/app/constants/api";

// 회원 탈퇴 요청을 보내는 함수
const logoutRequest = async ({ accessToken }: { accessToken: string | null }) => {
    const response = await instance.post(`/auth/logout`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log('로그아웃 성공', response.data);
    return response.data;
};

// useMutation을 사용하여 회원 탈퇴 처리를 하는 custom hook
export const useLogout = () => {
    const router = useRouter();

    return useMutation(logoutRequest, {
        onSuccess: () => {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
            router.push('/auth/login');
        },
        onError: (error) => {
            console.error('로그아웃 에러:', error);
        },
    });
};