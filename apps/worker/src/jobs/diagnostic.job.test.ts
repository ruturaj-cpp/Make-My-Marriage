import { describe, expect, it } from 'vitest';
import { diagnosticJobSchema } from './diagnostic.job';

describe('diagnostic job payload', () => {
  it('accepts a timestamped diagnostic request', () => {
    expect(diagnosticJobSchema.safeParse({ requestedAt: '2026-11-15T00:00:00.000Z' }).success).toBe(
      true,
    );
  });
});
