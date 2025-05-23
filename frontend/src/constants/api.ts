export const API_ENDPOINTS = {
   AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      ME: '/auth/me',
   },
   CONTACT: {
      CONTACT: 'contact/contact-us'
   }
} as const; 