export const API_ENDPOINTS = {
   AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH_TOKEN: '/auth/refresh-token',
      ME: '/auth/me',
   },
   CONTACT: {
      CONTACT: '/contact/contact-us',
      CONTACTS: '/contact'
   },
   MEDIA: {
      UPDATE: '/file/update',
      GET_BANNER: '/file/banner'
   }
} as const; 