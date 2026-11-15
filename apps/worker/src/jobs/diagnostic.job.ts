import { z } from 'zod';

export const diagnosticJobSchema = z.object({ requestedAt: z.string().datetime() });
export type DiagnosticJobData = z.infer<typeof diagnosticJobSchema>;
