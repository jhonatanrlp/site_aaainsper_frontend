import { describe, expect, it } from 'vitest';
import { isAllowedEmail } from './authApi.js';

describe('isAllowedEmail', () => {
  it('accepts the configured institutional domain', () => {
    expect(isAllowedEmail('student@al.insper.edu.br')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAllowedEmail('Student@AL.INSPER.EDU.BR')).toBe(true);
  });

  it('rejects an unrelated domain', () => {
    expect(isAllowedEmail('someone@gmail.com')).toBe(false);
  });

  it('rejects the bare (non-al.) insper.edu.br domain — UX check only, backend enforces the real rule', () => {
    expect(isAllowedEmail('staff@insper.edu.br')).toBe(false);
  });
});
