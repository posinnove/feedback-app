import { z } from 'zod';

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
    }),
});

export const userRegisterSchema = z.object({
    body: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        phoneNumber: z.string().optional(),
    }),
});

export const companyRegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Company name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        location: z.string().optional(),
        website: z.string().url('Invalid website URL').optional().or(z.literal('')),
        description: z.string().optional(),
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
