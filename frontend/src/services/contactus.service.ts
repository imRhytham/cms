import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { ApiError } from '@/types/auth';
import type { Contact, ContactUsRequest } from '@/types/contactUs';

export interface PaginatedResponse<T> {
   contacts: T[];
   pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
   };
}

class ContactUsService {
   async contactUs(payload: ContactUsRequest) {
      try {
         const { data } = await axiosInstance.post(
            API_ENDPOINTS.CONTACT.CONTACT,
            payload
         );
         return data;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message);
         }
         throw error;
      }
   }

   async getContacts(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Contact>> {
      try {
         const { data } = await axiosInstance.get<PaginatedResponse<Contact>>(
            API_ENDPOINTS.CONTACT.CONTACTS,
            { params }
         );
         return data;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Failed to fetch contacts');
         }
         throw error;
      }
   }
}

export const contactUsService = new ContactUsService(); 