import 'dotenv/config';
import { z } from 'zod';

const result = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    REDIS_HOST: z.string().default('127.0.0.1'),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_PASSWORD: z.string().optional(),
  })
  .safeParse(process.env);

if (!result.success) {
  throw new Error(
    `Invalid worker configuration: ${result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')}`,
  );
}

export const env = result.data;
