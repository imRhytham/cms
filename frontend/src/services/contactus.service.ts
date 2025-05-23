import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { ApiError } from '@/types/auth';

import { Contact, ContactResponse, ContactUsRequest } from '@/types/contactUs';


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

   async getContacts(): Promise<Contact[]> {
      try {
         const { data } = await axiosInstance.get<ContactResponse>('/contact');
         return data.contacts;
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