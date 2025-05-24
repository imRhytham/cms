export interface MediaFile {
   id: string;
   filename: string;
   originalname: string;
   mimetype: string;
   size: number;
   url: string;
   createdAt: string;
}

export interface MediaResponse {
   message: string;
   media: MediaFile;
}

export interface CloudinaryResponse {
   secure_url: string;
   original_filename: string;
   format: string;
   bytes: number;
}

export interface MediaUpdateRequest {
   url: string;
   filename: string;
   mimeType: string;
   size: number;
}

export interface MediaListResponse {
   file: MediaFile;
}

export interface MediaUploadRequest {
   file: File;
}