import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
})

export const userRegisterSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    phoneNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export const companyRegisterSchema = z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    location: z.string().optional(),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    description: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export type LoginInput = z.infer<typeof loginSchema>
export type UserRegisterInput = z.infer<typeof userRegisterSchema>
export type CompanyRegisterInput = z.infer<typeof companyRegisterSchema>
