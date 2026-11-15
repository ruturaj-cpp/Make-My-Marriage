import { describe, expect, it } from 'vitest';
import { appLanguageSchema } from './index';

describe('app language schema', () => {
  it('accepts the product languages and rejects unsupported values', () => {
    expect(appLanguageSchema.parse('mr')).toBe('mr');
    expect(appLanguageSchema.safeParse('fr').success).toBe(false);
  });
});
