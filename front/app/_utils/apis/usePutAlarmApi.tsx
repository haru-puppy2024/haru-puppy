import axios from 'axios';

//알람 설정 fetcher함수
export const fetchNotification = async (active: boolean, accessToken: string | null) => {
    try {
        const response = await axios.put(
            `/api/notifications?active=${active}`,
            null,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response) {
            console.error('알림 설정 요청 실패');
            throw new Error('알림 설정 요청 실패');
        }

        return response.data;
    } catch (error) {
        console.error('알림 설정을 요청하는 중 에러가 발생했습니다:', error);
        throw error;
    }
};

