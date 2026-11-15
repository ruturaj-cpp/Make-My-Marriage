import { describe, expect, it } from 'vitest';
import type { ApiSuccess, HealthData } from './index';

describe('shared API types', () => {
  it('allows a typed health success envelope', () => {
    const health: ApiSuccess<HealthData> = {
      success: true,
      message: 'API is healthy',
      data: { status: 'ok' },
    };
    expect(health.data.status).toBe('ok');
  });
});
