import { describe, it, expect } from 'vitest';
import { placeBetSchema, createPlaceBetSchema } from '../schema';
import type { AuctionDetail } from '@/shared/api/types';

const baseAuction = {
  uuid: 'test',
  cargo_num: 'CARGO-0001',
  auc_type: 'Up',
  status: 'Active',
  user_trading_status: 'None',
  load_city: 'Москва',
  unload_city: 'Казань',
  load_date: '2026-08-01',
  cargo_name: 'Овощи',
  cargo_weight_tonn: 20,
  body_type: 'Рефрижератор',
  current_price: 100000,
  min_price: null,
  max_price: null,
  bet_step: null,
  my_bet_exists: false,
  can_set_bet: true,
  created_at: '2026-07-30T10:00:00Z',
} as AuctionDetail;

describe('placeBetSchema (base)', () => {
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

describe('createPlaceBetSchema (dynamic)', () => {
  it('Up auction rejects price below current', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Up', current_price: 100000 });
    const result = schema.safeParse({ price: 90000 });
    expect(result.success).toBe(false);
  });

  it('Up auction accepts price above current', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Up', current_price: 100000 });
    const result = schema.safeParse({ price: 110000 });
    expect(result.success).toBe(true);
  });

  it('Down auction rejects price above current', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Down', current_price: 100000 });
    const result = schema.safeParse({ price: 110000 });
    expect(result.success).toBe(false);
  });

  it('Down auction accepts price below current', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Down', current_price: 100000 });
    const result = schema.safeParse({ price: 90000 });
    expect(result.success).toBe(true);
  });

  it('Request auction accepts any price', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Request', current_price: 100000 });
    const result = schema.safeParse({ price: 50000 });
    expect(result.success).toBe(true);
  });

  it('validates bet_step for Up auction', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Up', current_price: 100000, bet_step: 5000 });
    expect(schema.safeParse({ price: 103000 }).success).toBe(false);
    expect(schema.safeParse({ price: 105000 }).success).toBe(true);
    expect(schema.safeParse({ price: 110000 }).success).toBe(true);
  });

  it('validates bet_step for Down auction', () => {
    const schema = createPlaceBetSchema({ ...baseAuction, auc_type: 'Down', current_price: 100000, bet_step: 5000 });
    expect(schema.safeParse({ price: 97000 }).success).toBe(false);
    expect(schema.safeParse({ price: 95000 }).success).toBe(true);
    expect(schema.safeParse({ price: 90000 }).success).toBe(true);
  });
});