import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const instance = axios.create({
  baseURL: 'https://port-0-haru-puppy-backend-1cupyg2klv9dkg9z.sel5.cloudtype.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('API 요청 중 에러가 발생했습니다', error);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    if (response.status === 404) {
      console.log('404 페이지로 넘어가야 함!');
    }
    return response;
  },
  async (error) => {
    if (
      error.response?.status === 401 &&
      error.response.data.message === '요청 토큰이 만료되었습니다'
    ) {
      try {
        const refreshToken = cookies.get('refresh_token');
        const refreshResponse = await axios.post('/auth/refresh', { refreshToken });

        const { accessToken } = refreshResponse.data;

        // Set new access token in headers and cookies
        instance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        cookies.set('access_token', accessToken, { path: '/', sameSite: 'strict' });

        // Retry the original request with the new token
        const response = await axios.request({
          ...error.config,
          headers: { ...error.config.headers, Authorization: `Bearer ${accessToken}` },
        });

        // Store new tokens from response if available
        const newAccessToken = response.headers['access-token'];
        const newRefreshToken = response.headers['refresh-token'];
        if (newAccessToken) {
          cookies.set('access_token', newAccessToken, { path: '/', sameSite: 'strict' });
          cookies.set('refresh_token', newRefreshToken, {
            path: '/',
            sameSite: 'strict',
          });
        }
        return response;
      } catch (refreshError) {
        console.error('토큰 리프레시 실패:', refreshError);
        // Redirect to login or handle error
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
