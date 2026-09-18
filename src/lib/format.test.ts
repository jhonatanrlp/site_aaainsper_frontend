import { describe, expect, it } from 'vitest';
import { formatCentsToBRL, formatDate } from './format.js';

describe('formatDate', () => {
  it('formats a date-only value without shifting the day across timezones', () => {
    expect(formatDate('2001-03-09')).toBe('09/03/2001');
  });

  it('returns a dash for empty or invalid values', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('')).toBe('—');
    expect(formatDate('not-a-date')).toBe('—');
  });
});

describe('formatCentsToBRL', () => {
  it('formats cents as Brazilian reais', () => {
    expect(formatCentsToBRL(12990).replace(/\s/g, ' ')).toBe('R$ 129,90');
  });
});
