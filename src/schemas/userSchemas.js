import { z } from 'zod';
import { fi } from 'zod/locales';

export const registerSchema = z.object({
    firstName: z.string().min(6),
    lastName: z.string().min(6),
    email: z.string().email(),
    phone: z.string().min(6).max(20).optional().or(z.literal("")),
    password: z.string().min(8),
    profileImage: z.string().url().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export const updateUserSchema = z.object({
    firstName: z.string().min(6).optional(),
    lastName: z.string().min(6).optional(),
    phone: z.string().min(6).max(20).optional(),
    password: z.string().min(8).optional(),
    profileImage: z.string().url().optional(),
    isActive: z.boolean().optional(),
});