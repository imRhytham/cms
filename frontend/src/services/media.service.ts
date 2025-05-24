import { isAxiosError } from 'axios';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants/api';
import type { ApiError } from '@/types/auth';
import { CloudinaryResponse, MediaFile, MediaListResponse, MediaResponse, MediaUpdateRequest, MediaUploadRequest } from '@/types/media';



class MediaService {
   private readonly CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ''}/image/upload`;

   async uploadToCloudinary(file: File): Promise<CloudinaryResponse> {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
      formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '');


      try {
         const response = await fetch(this.CLOUDINARY_UPLOAD_URL, {
            method: 'POST',
            body: formData,
         });

         if (!response.ok) {
            throw new Error('Failed to upload to Cloudinary');
         }

         return await response.json();
      } catch (error) {
         console.error('Cloudinary upload error:', error);
         throw new Error('Failed to upload image');
      }
   }

   async updateMediaUrl(payload: MediaUpdateRequest): Promise<MediaFile> {
      try {
         const { data } = await axiosInstance.post<MediaResponse>(
            API_ENDPOINTS.MEDIA.UPDATE,
            payload
         );
         return data.media;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Failed to update media');
         }
         throw error;
      }
   }

   async getBanner(): Promise<MediaFile | null> {
      try {
         const { data } = await axiosInstance.get<{ file: MediaFile | null }>(
            API_ENDPOINTS.MEDIA.GET_BANNER
         );
         return data.file;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Failed to fetch banner');
         }
         throw error;
      }
   }

   async uploadFile(payload: MediaUploadRequest): Promise<MediaFile> {
      try {
         const formData = new FormData();
         formData.append('file', payload.file);

         const { data } = await axiosInstance.post<MediaResponse>(
            API_ENDPOINTS.MEDIA.UPDATE,
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );
         return data.media;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Failed to upload file');
         }
         throw error;
      }
   }



   async getFiles(): Promise<MediaFile> {
      try {
         const { data } = await axiosInstance.get<MediaListResponse>(
            API_ENDPOINTS.MEDIA.GET_BANNER,
         );
         ;
         return data.file;
      } catch (error: unknown) {
         if (isAxiosError(error)) {
            const apiError = error.response?.data as ApiError;
            throw new Error(apiError?.message || 'Failed to fetch files');
         }
         throw error;
      }
   }
}

export const mediaService = new MediaService(); 