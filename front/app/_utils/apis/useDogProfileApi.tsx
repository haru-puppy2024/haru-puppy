import { useRouter } from 'next/navigation';
import { useMutation } from "react-query";
import instance from './interceptors'; // Ensure this is set up to handle requests correctly
import { IDogProfile } from '@/app/_types/user/Dog';

// API 요청 함수 수정 (Update Profile)
const updateDogProfileRequest = async ({ accessToken, formData }: { accessToken: string | null, formData: IDogProfile }) => {
    console.log('요청 formData', formData)
    const response = await instance.patch('/api/dogs', {
        ...formData
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });

    console.log('프로필 업데이트 성공', response.data);
    return response.data;
};

// useMutation 사용하여 프로필 업데이트 처리
export const updateDogProfileAPI = ({ accessToken, formData }: { accessToken: string | null, formData: IDogProfile }) => {
    const router = useRouter();

    return useMutation(() => updateDogProfileRequest({ accessToken, formData }), {
        onSuccess: () => {
            console.log('프로필이 성공적으로 업데이트되었습니다.', formData);
            localStorage.setItem('DogInfo', JSON.stringify(formData))
            router.push('/');
        },
        onError: (error) => {
            console.error('프로필 업데이트 에러:', error);
        },
    });
};