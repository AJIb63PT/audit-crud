import { describe, it, expect } from 'vitest';
import { toAuctionCard, formatPrice, formatDate } from '../mappers';
import { AuctionType, AuctionStatus, UserTradingStatus } from '@/shared/api/types';

const mockItem = {
  uuid: 'test-uuid',
  cargo_num: 'CARGO-0001',
  auc_type: AuctionType.Down,
  status: AuctionStatus.Active,
  user_trading_status: UserTradingStatus.Leading,
  load_city: 'Москва',
  unload_city: 'Казань',
  load_date: '2026-08-01',
  unload_date: '2026-08-05',
  cargo_name: 'Овощи',
  cargo_weight_tonn: 20,
  cargo_volume_m3: 82,
  body_type: 'Рефрижератор',
  current_price: 145000,
  price_per_km: 120,
  bet_step: 3000,
  my_bet_exists: true,
  can_set_bet: true,
  created_at: '2026-07-30T10:00:00Z',
};

describe('mappers', () => {
  it('maps AuctionListItem to view model', () => {
    const vm = toAuctionCard(mockItem);
    expect(vm.uuid).toBe('test-uuid');
    expect(vm.cargoNum).toBe('CARGO-0001');
    expect(vm.typeLabel).toBe('Аукцион ↓');
    expect(vm.statusLabel).toBe('Активен');
    expect(vm.tradingLabel).toBe('Лидируете');
    expect(vm.route).toBe('Москва → Казань');
    expect(vm.currentPrice).toContain('145');
    expect(vm.pricePerKm).toContain('/км');
    expect(vm.betStep).toContain('3');
    expect(vm.myBetExists).toBe(true);
    expect(vm.canSetBet).toBe(true);
    expect(vm.isFixPrice).toBe(false);
  });

  it('maps status keys correctly', () => {
    const vm = toAuctionCard(mockItem);
    expect(vm.statusKey).toBe('Active');
    expect(vm.tradingStatusKey).toBe('Leading');
  });

  it('formats price correctly', () => {
    const formatted = formatPrice(1234567);
    expect(formatted).toContain('1');
    expect(formatted).toContain('₽');
  });

  it('formats date correctly', () => {
    const formatted = formatDate('2026-08-01');
    expect(formatted).toBe('01.08.2026');
  });
});