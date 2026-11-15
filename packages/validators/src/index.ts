import { z } from 'zod';

export const appLanguageSchema = z.enum(['en', 'mr', 'hi']);
export type AppLanguageValue = z.infer<typeof appLanguageSchema>;
