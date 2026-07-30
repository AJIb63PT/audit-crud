import type { AuctionType, AuctionStatus, UserTradingStatus } from '@/shared/api/types';

export const STATUS_LABELS: Record<string, string> = {
  Active: 'Активен',
  Finished: 'Завершён',
  Cancelled: 'Отменён',
  Draft: 'Черновик',
};

export const TRADING_LABELS: Record<string, string> = {
  None: '—',
  Leading: 'Лидируете',
  Losing: 'Проигрываете',
  Winner: 'Победитель',
  Outbid: 'Перебита',
};

export const TYPE_LABELS: Record<AuctionType, string> = {
  Request: 'Запрос',
  Up: 'Аукцион ↑',
  Down: 'Аукцион ↓',
  FixPrice: 'Фикс. цена',
};

export function statusLabel(status: AuctionStatus | string): string {
  return STATUS_LABELS[status] ?? status;
}

export function tradingLabel(status: UserTradingStatus | string): string {
  return TRADING_LABELS[status] ?? status;
}

export function typeLabel(type: AuctionType): string {
  return TYPE_LABELS[type] ?? type;
}

export function statusClass(status: string): string {
  const map: Record<string, string> = {
    Active: 'text-green-600',
    Finished: 'text-gray-500',
    Cancelled: 'text-red-600',
    Draft: 'text-amber-600',
  };
  return map[status] ?? 'text-gray-900';
}

export function statusBadgeClass(status: string): string {
  const map: Record<string, string> = {
    Active: 'bg-green-100 text-green-600',
    Finished: 'bg-gray-100 text-gray-500',
    Cancelled: 'bg-red-100 text-red-600',
    Draft: 'bg-amber-100 text-amber-600',
  };
  return map[status] ?? 'bg-gray-100 text-gray-900';
}

export function tradingBadgeClass(status: string): string {
  const map: Record<string, string> = {
    None: 'bg-gray-100 text-gray-400',
    Leading: 'bg-green-100 text-green-600',
    Losing: 'bg-amber-100 text-amber-600',
    Winner: 'bg-blue-100 text-blue-600',
    Outbid: 'bg-red-100 text-red-600',
  };
  return map[status] ?? 'bg-gray-100 text-gray-900';
}