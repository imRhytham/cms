import { ACCESS_TOKEN } from '@/utils/constant';
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie } from 'cookies-next';
import { authService } from '@/services/auth.service';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
   baseURL,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Request interceptor
axiosInstance.interceptors.request.use(
   (config: InternalAxiosRequestConfig) => {
      const token = getCookie(ACCESS_TOKEN);
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
   },
   (error: AxiosError) => {
      return Promise.reject(error);
   }
);

// Response interceptor
axiosInstance.interceptors.response.use(
   (response: AxiosResponse) => response,
   async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Handle 401 Unauthorized errors
      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;

         try {
            // Try to refresh the token
            const newAccessToken = await authService.refreshToken();

            // Update the authorization header
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Retry the original request
            return axiosInstance(originalRequest);
         } catch (refreshError) {
            // If refresh token fails, logout and redirect to login
            await authService.logout();
            window.location.href = '/admin/login';
            return Promise.reject(refreshError);
         }
      }

      return Promise.reject(error);
   }
);

export default axiosInstance; 