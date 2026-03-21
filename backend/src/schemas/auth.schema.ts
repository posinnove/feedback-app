import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const googleLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Google idToken is required'),
    accountType: z.enum(['user', 'company']).optional(),
  }),
});

export const userRegisterSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const companyRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const userProfileUpdateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    avatarUrl: z.string().url('Invalid avatar URL').optional(),
    phoneNumber: z.string().optional(),
  }),
});

export const companyProfileUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    location: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    description: z.string().optional(),
    logoUrl: z.string().url('Invalid logo URL').optional(),
  }),
});

export const settingsUpdateSchema = z.object({
  body: z.object({
    emailNotifications: z.boolean(),
    weeklyDigest: z.boolean(),
    publicProfile: z.boolean(),
    themeMode: z.enum(['system', 'light', 'dark']),
  }),
});

export const passwordUpdateSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
  }),
});
