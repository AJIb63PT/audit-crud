import { describe, it, expect } from 'vitest';

function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

describe('request-builder', () => {
  it('builds query string with non-empty values', () => {
    const qs = buildQueryString({ page: 1, status: 'Active', empty: '', nullVal: null, undefVal: undefined });
    expect(qs).toContain('page=1');
    expect(qs).toContain('status=Active');
    expect(qs).not.toContain('empty=');
    expect(qs).not.toContain('nullVal=');
    expect(qs).not.toContain('undefVal=');
  });

  it('returns empty string for empty params', () => {
    const qs = buildQueryString({ a: undefined, b: null, c: '' });
    expect(qs).toBe('');
  });

  it('handles boolean values', () => {
    const qs = buildQueryString({ is_available: true });
    expect(qs).toBe('is_available=true');
  });
});
