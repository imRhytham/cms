import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { LoginCredentials, LoginResponse, ApiError } from '@/types/auth';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/utils/constant';


class AuthService {
   async login(credentials: LoginCredentials): Promise<LoginResponse> {
      try {
         const { data } = await axiosInstance.post<LoginResponse>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
         );

         this.setTokens(data.accessToken, data.refreshToken);
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
         this.clearTokens();
      }
   }

   async refreshToken(): Promise<string> {
      try {
         const refreshToken = getCookie(REFRESH_TOKEN);
         if (!refreshToken) {
            throw new Error('No refresh token available');
         }

         const { data } = await axiosInstance.post<LoginResponse>(
            API_ENDPOINTS.AUTH.REFRESH_TOKEN,
            { refreshToken }
         );

         this.setTokens(data.accessToken, data.refreshToken);
         return data.accessToken;
      } catch (error) {
         this.clearTokens();
         throw error;
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

   private setTokens(accessToken: string, refreshToken: string) {
      setCookie(ACCESS_TOKEN, accessToken);
      setCookie(REFRESH_TOKEN, refreshToken);
   }

   private clearTokens() {
      deleteCookie(ACCESS_TOKEN);
      deleteCookie(REFRESH_TOKEN);
   }

   isAuthenticated(): boolean {
      return !!getCookie(ACCESS_TOKEN);
   }
}

export const authService = new AuthService(); 