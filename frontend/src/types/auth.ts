export interface LoginCredentials {
   email: string;
   password: string;
}

export interface LoginResponse {
   accessToken: string
   refreshToken: string
}

export interface ApiError {
   message: string;
   statusCode: number;
   errors?: Record<string, string[]>;
} 