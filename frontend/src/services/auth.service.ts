import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { LoginCredentials, LoginResponse, ApiError } from '@/types/auth';
import { setCookie } from 'cookies-next';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/utils/constant';


class AuthService {
   async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
         const { data } = await axiosInstance.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
         );

         setCookie(ACCESS_TOKEN, data.accessToken)
         setCookie(REFRESH_TOKEN, data.refreshToken)

         return data;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Login failed');
         }
         throw error;
      }
   }

   async logout(): Promise<void> {
      try {
         await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
      } finally {
         // Clear token regardless of API call success
         localStorage.removeItem('token');
      }
   }

   async getCurrentUser() {
      try {
         const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
         return data;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Failed to get current user');
         }
         throw error;
      }
   }

   isAuthenticated(): boolean {
      return !!localStorage.getItem('token');
   }
}

export const authService = new AuthService(); 