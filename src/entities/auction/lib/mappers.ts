import type { AuctionListItem } from '@/shared/api/types';
import { statusLabel, tradingLabel, typeLabel } from './status';

export interface AuctionCardVM {
  uuid: string;
  cargoNum: string;
  typeLabel: string;
  statusKey: string;
  statusLabel: string;
  tradingStatusKey: string;
  tradingLabel: string;
  route: string;
  loadDate: string;
  unloadDate: string | null;
  cargoName: string;
  weight: string;
  volume: string | null;
  bodyType: string;
  currentPrice: string;
  pricePerKm: string | null;
  betStep: string | null;
  myBetExists: boolean;
  canSetBet: boolean;
  isFixPrice: boolean;
}

export function toAuctionCard(dto: AuctionListItem): AuctionCardVM {
  return {
    uuid: dto.uuid,
    cargoNum: dto.cargo_num,
    typeLabel: typeLabel(dto.auc_type),
    statusKey: dto.status,
    statusLabel: statusLabel(dto.status),
    tradingStatusKey: dto.user_trading_status,
    tradingLabel: tradingLabel(dto.user_trading_status),
    route: `${dto.load_city} → ${dto.unload_city}`,
    loadDate: dto.load_date,
    unloadDate: dto.unload_date ?? null,
    cargoName: dto.cargo_name,
    weight: `${dto.cargo_weight_tonn} т`,
    volume: dto.cargo_volume_m3 != null ? `${dto.cargo_volume_m3} м³` : null,
    bodyType: dto.body_type,
    currentPrice: formatPrice(dto.current_price),
    pricePerKm: dto.price_per_km != null ? `${formatPrice(dto.price_per_km)}/км` : null,
    betStep: dto.bet_step != null ? formatPrice(dto.bet_step) : null,
    myBetExists: dto.my_bet_exists,
    canSetBet: dto.can_set_bet,
    isFixPrice: dto.auc_type === 'FixPrice',
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU');
}