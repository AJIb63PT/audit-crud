import { describe, it, expect } from 'vitest';
import { placeBetSchema } from '../schema';

describe('place-bet schema', () => {
  it('validates correct data', () => {
    const result = placeBetSchema.safeParse({ price: 100000, comment: 'Тест' });
    expect(result.success).toBe(true);
  });

  it('validates without optional comment', () => {
    const result = placeBetSchema.safeParse({ price: 50000 });
    expect(result.success).toBe(true);
  });

  it('rejects zero price', () => {
    const result = placeBetSchema.safeParse({ price: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects negative price', () => {
    const result = placeBetSchema.safeParse({ price: -100 });
    expect(result.success).toBe(false);
  });

  it('rejects missing price', () => {
    const result = placeBetSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects non-numeric price', () => {
    const result = placeBetSchema.safeParse({ price: 'abc' });
    expect(result.success).toBe(false);
  });

  it('rejects long comment', () => {
    const result = placeBetSchema.safeParse({ price: 100, comment: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('accepts empty comment', () => {
    const result = placeBetSchema.safeParse({ price: 100, comment: '' });
    expect(result.success).toBe(true);
  });
});
