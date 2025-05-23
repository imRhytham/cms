import Joi from 'joi';

// Patterns to identify and remove malicious content
const MALICIOUS_PATTERNS = [
   /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
   /javascript:/gi, // JavaScript protocol
   /data:/gi, // Data URLs
   /on\w+="[^"]*"/gi, // Event handlers
   /on\w+='[^']*'/gi, // Event handlers with single quotes
   /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, // Iframe tags
   /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, // Embed tags
];

// Custom sanitization function
const sanitizeText = (value: string): string => {
   if (!value) return '';
   let sanitized = value;
   MALICIOUS_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
   });

   // Remove HTML tags
   sanitized = sanitized.replace(/<[^>]*>/g, '');
   // Trim whitespace
   return sanitized.trim();
};

// Contact form validation schema
export const contactSchema = Joi.object({
   name: Joi.string()
      .required()
      .min(2)
      .max(100)
      .custom((value, helpers) => {
         const sanitized = sanitizeText(value);
         if (sanitized.length < 2) {
            return helpers.error('string.min');
         }
         return sanitized;
      }, 'sanitize')
      .messages({
         'string.empty': 'Name is required',
         'string.min': 'Name must be at least 2 characters long',
         'string.max': 'Name must not exceed 100 characters',
      }),

   email: Joi.string()
      .required()
      .email()
      .normalize()
      .messages({
         'string.empty': 'Email is required',
         'string.email': 'Invalid email address',
      }),

   phone: Joi.string()
      .optional()
      .pattern(/^\d{10}$/)
      .custom((value, helpers) => {
         if (value) {
            return sanitizeText(value);
         }
         return value;
      }, 'sanitize')
      .messages({
         'string.pattern.base': 'Phone must be 10 digits',
      }),

   message: Joi.string()
      .required()
      .min(10)
      .max(1000)
      .custom((value, helpers) => {
         const sanitized = sanitizeText(value);
         if (sanitized.length < 10) {
            return helpers.error('string.min');
         }
         return sanitized;
      }, 'sanitize')
      .messages({
         'string.empty': 'Message is required',
         'string.min': 'Message must be at least 10 characters long',
         'string.max': 'Message must not exceed 1000 characters',
      }),

   pincode: Joi.string()
      .optional()
      .pattern(/^\d{6}$/)
      .custom((value, helpers) => {
         if (value) {
            return sanitizeText(value);
         }
         return value;
      }, 'sanitize')
      .messages({
         'string.pattern.base': 'Pincode must be 6 digits',
      }),
});

// Contact status update schema
export const contactStatusSchema = Joi.object({
   status: Joi.string()
      .required()
      .valid('pending', 'read', 'replied')
      .messages({
         'string.empty': 'Status is required',
         'any.only': 'Status must be one of: pending, read, replied',
      }),
});

// Validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
   return (req: any, res: any, next: any) => {
      const { error, value } = schema.validate(req.body, {
         abortEarly: false,
         stripUnknown: true,
      });

      if (error) {
         const errors = error.details.map((detail) => ({
            field: detail.path[0],
            message: detail.message,
         }));
         return res.status(400).json({ errors });
      }

      // Replace request body with sanitized values
      req.body = value;
      next();
   };
}; 