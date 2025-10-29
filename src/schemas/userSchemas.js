import { z } from 'zod';
import { fi } from 'zod/locales';

export const registerSchema = z.object({
    firstName: z.string().min(6, { message: fi.firstName.minLength }),
    lastName: z.string().min(6, { message: fi.lastName.minLength }),
    email: z.string().email({ message: fi.email.invalid }),
    phone: z.string().min(6).max(20).optional().or(z.literal("")),
    password: z.string().min(8, { message: fi.password.minLength }),
    profileImage: z.string().url().optional(),
});

export const loginSchema = z.object({
    email: z.string().email({ message: fi.email.invalid }),
    password: z.string().min(8, { message: fi.password.minLength }),
});

export const updateUserSchema = z.object({
    firstName: z.string().min(6, { message: fi.firstName.minLength }).optional(),
    lastName: z.string().min(6, { message: fi.lastName.minLength }).optional(),
    phone: z.string().min(6).max(20).optional().or(z.literal("")),
    password: z.string().min(8, { message: fi.password.minLength }).optional(),
    profileImage: z.string().url().optional(),
    isActive: z.boolean().optional(),
});