import { AuctionType, AuctionStatus, UserTradingStatus } from '../types';
import type { AuctionListItem, AuctionDetail, AuctionBet } from '../types';

let bidCounter = 100;

function createUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const now = new Date();
const day = (d: number) => new Date(now.getTime() + d * 86400000).toISOString().slice(0, 10);
const dt = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();

interface StoreAuction {
  item: AuctionListItem;
  detail: AuctionDetail;
}

const auctionConfigs: Array<{
  type: AuctionType;
  status: AuctionStatus;
  tradingStatus: UserTradingStatus;
  load: string;
  unload: string;
  price: number;
  betStep: number | null;
  myBetExists: boolean;
  canSetBet: boolean;
  hideBets: boolean;
  hideContacts: boolean;
  noViewPrice: boolean;
  weight: number;
  volume: number | null;
  bodyType: string;
  cargoName: string;
}> = [
  { type: 'Down', status: 'Active', tradingStatus: 'Leading', load: 'Москва', unload: 'Казань', price: 145000, betStep: 3000, myBetExists: true, canSetBet: true, hideBets: false, hideContacts: false, noViewPrice: false, weight: 20, volume: 82, bodyType: 'Рефрижератор', cargoName: 'Овощи свежие' },
  { type: 'Up', status: 'Active', tradingStatus: 'Losing', load: 'Санкт-Петербург', unload: 'Краснодар', price: 98000, betStep: 2000, myBetExists: true, canSetBet: true, hideBets: false, hideContacts: true, noViewPrice: false, weight: 12, volume: 40, bodyType: 'Тент', cargoName: 'Стройматериалы' },
  { type: 'Request', status: 'Active', tradingStatus: 'None', load: 'Новосибирск', unload: 'Москва', price: 210000, betStep: null, myBetExists: false, canSetBet: true, hideBets: true, hideContacts: false, noViewPrice: true, weight: 25, volume: null, bodyType: 'Открытый', cargoName: 'Металлопрокат' },
  { type: 'FixPrice', status: 'Active', tradingStatus: 'Winner', load: 'Краснодар', unload: 'Санкт-Петербург', price: 175000, betStep: null, myBetExists: true, canSetBet: false, hideBets: false, hideContacts: false, noViewPrice: false, weight: 18, volume: 60, bodyType: 'Рефрижератор', cargoName: 'Молочная продукция' },
  { type: 'Down', status: 'Finished', tradingStatus: 'Outbid', load: 'Казань', unload: 'Москва', price: 120000, betStep: 2500, myBetExists: true, canSetBet: false, hideBets: false, hideContacts: false, noViewPrice: false, weight: 10, volume: 30, bodyType: 'Фургон', cargoName: 'Мебель' },
  { type: 'Up', status: 'Active', tradingStatus: 'None', load: 'Москва', unload: 'Новосибирск', price: 250000, betStep: 5000, myBetExists: false, canSetBet: true, hideBets: false, hideContacts: false, noViewPrice: false, weight: 22, volume: 86, bodyType: 'Тент', cargoName: 'Оборудование' },
  { type: 'Request', status: 'Draft', tradingStatus: 'None', load: 'Санкт-Петербург', unload: 'Казань', price: 0, betStep: null, myBetExists: false, canSetBet: false, hideBets: false, hideContacts: false, noViewPrice: false, weight: 8, volume: 25, bodyType: 'Фургон', cargoName: 'Запчасти' },
  { type: 'FixPrice', status: 'Active', tradingStatus: 'Losing', load: 'Краснодар', unload: 'Москва', price: 165000, betStep: null, myBetExists: true, canSetBet: false, hideBets: false, hideContacts: true, noViewPrice: false, weight: 15, volume: 50, bodyType: 'Тент', cargoName: 'Одежда' },
  { type: 'Down', status: 'Active', tradingStatus: 'Leading', load: 'Москва', unload: 'Санкт-Петербург', price: 89000, betStep: 1000, myBetExists: true, canSetBet: true, hideBets: false, hideContacts: false, noViewPrice: false, weight: 5, volume: 18, bodyType: 'Фургон', cargoName: 'Электроника' },
  { type: 'Up', status: 'Finished', tradingStatus: 'Winner', load: 'Новосибирск', unload: 'Краснодар', price: 310000, betStep: 4000, myBetExists: true, canSetBet: false, hideBets: false, hideContacts: false, noViewPrice: false, weight: 30, volume: 95, bodyType: 'Рефрижератор', cargoName: 'Замороженная продукция' },
  { type: 'Request', status: 'Active', tradingStatus: 'None', load: 'Новосибирск', unload: 'Владивосток', price: 400000, betStep: null, myBetExists: false, canSetBet: true, hideBets: false, hideContacts: false, noViewPrice: false, weight: 20, volume: 70, bodyType: 'Открытый', cargoName: 'Лесоматериалы' },
  { type: 'Down', status: 'Active', tradingStatus: 'None', load: 'Москва', unload: 'Краснодар', price: 135000, betStep: 2000, myBetExists: false, canSetBet: true, hideBets: false, hideContacts: false, noViewPrice: false, weight: 16, volume: 55, bodyType: 'Тент', cargoName: 'Промышленное оборудование' },
];

const generatedAuctions = new Map<string, StoreAuction>();
const generatedBets = new Map<string, AuctionBet[]>();

export function generateAuctions(): void {
  generatedAuctions.clear();
  generatedBets.clear();

  auctionConfigs.forEach((cfg, idx) => {
    const uuid = createUuid();
    const cargoNum = `CARGO-${String(idx + 1).padStart(4, '0')}`;
    const distance = Math.floor(Math.random() * 3000) + 200;
    const pricePerKm = cfg.price > 0 && distance > 0 ? Math.round(cfg.price / distance) : null;

    const item: AuctionListItem = {
      uuid,
      cargo_num: cargoNum,
      auc_type: cfg.type,
      status: cfg.status,
      user_trading_status: cfg.tradingStatus,
      load_city: cfg.load,
      unload_city: cfg.unload,
      load_date: day(3 + idx),
      unload_date: day(6 + idx),
      cargo_name: cfg.cargoName,
      cargo_weight_tonn: cfg.weight,
      cargo_volume_m3: cfg.volume,
      body_type: cfg.bodyType,
      current_price: cfg.price,
      price_per_km: pricePerKm,
      bet_step: cfg.betStep,
      my_bet_exists: cfg.myBetExists,
      can_set_bet: cfg.canSetBet,
      created_at: dt(-idx * 2),
    };

    const detail: AuctionDetail = {
      ...item,
      description: cfg.status === 'Active' ? `Перевозка груза: ${cfg.cargoName}. Требуется транспорт ${cfg.bodyType}.` : null,
      organizer_name: `ООО "Грузоперевозки ${idx + 1}"`,
      organizer_rating: Math.round(Math.random() * 50) / 10 + 4,
      contact_person: cfg.hideContacts ? undefined : `Иван Иванович ${idx + 1}`,
      contact_phone: cfg.hideContacts ? undefined : `+7 (999) ${String(100 + idx).slice(1)}-${String(10 + idx).padStart(2, '0')}-${String(idx).padStart(2, '0')}`,
      load_address: `${cfg.load}, ул. Промышленная, ${idx + 1}`,
      unload_address: `${cfg.unload}, ул. Логистическая, ${idx + 1}`,
      load_date_from: dt(3 + idx),
      load_date_to: dt(5 + idx),
      unload_date_from: cfg.unload ? dt(6 + idx) : undefined,
      unload_date_to: cfg.unload ? dt(8 + idx) : undefined,
      cargo_type: cfg.cargoName,
      loading_type: idx % 2 === 0 ? 'Верхняя' : 'Боковая',
      min_price: cfg.type === 'Down' ? Math.round(cfg.price * 0.7) : null,
      max_price: cfg.type === 'Up' ? Math.round(cfg.price * 1.5) : cfg.type === 'Request' ? Math.round(cfg.price * 1.2) : null,
      start_price: cfg.type === 'Down' || cfg.type === 'Up' ? cfg.price : null,
      currency: 'RUB',
      vat_included: idx % 2 === 0,
      payment_term_days: [7, 14, 21, 30][idx % 4],
      payment_term_type: 'Банковский день',
      can_set_bet: cfg.canSetBet,
      hide_bets_history: cfg.hideBets,
      hide_points_address_and_contacts: cfg.hideContacts,
      no_view_cargo_price: cfg.noViewPrice,
      distance_km: distance,
      my_bet: null,
    };

    generatedAuctions.set(uuid, { item, detail });
    generatedBets.set(uuid, []);
  });

  generateInitialBets();
}

function generateInitialBets(): void {
  const uuids = Array.from(generatedAuctions.keys());

  uuids.forEach((auctionUuid) => {
    const store = generatedAuctions.get(auctionUuid)!;
    const betCount = Math.floor(Math.random() * 4) + 1;
    const bets: AuctionBet[] = [];
    const basePrice = store.detail.current_price;

    for (let i = 0; i < betCount; i++) {
      const rank = i + 1;
      const priceAdjustment = store.detail.auc_type === 'Down'
        ? -(i * 5000)
        : i * 5000;
      const price = Math.max(basePrice + priceAdjustment, 1000);
      const vat = Math.round(price * 0.2);
      const isMine = i === 0 && store.item.my_bet_exists;

      bidCounter++;
      const bet: AuctionBet = {
        uuid: `bet-${bidCounter}-${i}`,
        auction_uuid: auctionUuid,
        carrier_name: [`ООО "ТрансЛогистика"`, `ИП "Петров А.В."`, `ООО "АвтоПеревозки"`, `ООО "Северные Трассы"`][i % 4],
        carrier_rating: Math.round(Math.random() * 20 + 40) / 10,
        price,
        price_with_vat: vat ? price + vat : undefined,
        price_without_vat: vat ? price : undefined,
        comment: i === 0 && isMine ? 'Готовы рассмотреть гибкие условия' : null,
        status: i === 0 && store.item.status === 'Finished' ? (isMine ? 'Won' : 'Lost') : 'Active',
        cancel_reason: null,
        is_winner: i === 0 && store.item.status === 'Finished' && isMine,
        is_mine: isMine,
        rank,
        created_at: dt(-(betCount - i) * 2),
      };
      bets.push(bet);
    }

    if (store.item.my_bet_exists && bets.length > 0) {
      store.detail.my_bet = bets[0];
    }

    generatedBets.set(auctionUuid, bets);
  });
}

export function getAllAuctions(): StoreAuction[] {
  return Array.from(generatedAuctions.values());
}

export function getAuction(uuid: string): StoreAuction | undefined {
  return generatedAuctions.get(uuid);
}

export function getBets(auctionUuid: string): AuctionBet[] {
  return generatedBets.get(auctionUuid) ?? [];
}

export function addBet(auctionUuid: string, price: number, comment?: string | null): AuctionBet {
  const store = generatedAuctions.get(auctionUuid);
  if (!store) throw new Error('Auction not found');

  bidCounter++;
  const existingBets = generatedBets.get(auctionUuid) ?? [];
  const rank = existingBets.length + 1;
  const vat = Math.round(price * 0.2);

  const bet: AuctionBet = {
    uuid: `bet-${bidCounter}`,
    auction_uuid: auctionUuid,
    carrier_name: 'ООО "Моя Компания"',
    carrier_rating: 4.5,
    price,
    price_with_vat: price + vat,
    price_without_vat: price,
    comment: comment ?? null,
    status: 'Active',
    cancel_reason: null,
    is_winner: false,
    is_mine: true,
    rank,
    created_at: new Date().toISOString(),
  };

  existingBets.push(bet);
  generatedBets.set(auctionUuid, existingBets);

  store.detail.my_bet = bet;
  store.detail.current_price = price;
  store.detail.my_bet_exists = true;
  store.detail.can_set_bet = false;
  store.detail.user_trading_status = store.detail.auc_type === 'Down' ? 'Losing' : 'Leading';
  store.item.current_price = price;
  store.item.my_bet_exists = true;
  store.item.can_set_bet = false;
  store.item.user_trading_status = store.detail.auc_type === 'Down' ? 'Losing' : 'Leading';

  return bet;
}

export function filterAuctions(params: {
  cargo_num?: string | null;
  status?: string | null;
  statuses?: string[] | null;
  auc_type?: string | null;
  load_city?: string | null;
  unload_city?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  is_available?: boolean | null;
  is_bidder?: boolean | null;
  price_from?: number | null;
  price_to?: number | null;
  page?: number;
  per_page?: number;
}): { data: AuctionListItem[]; total: number; page: number; per_page: number; total_pages: number } {
  let items = Array.from(generatedAuctions.values()).map((s) => s.item);

  if (params.cargo_num) {
    items = items.filter((a) => a.cargo_num.toLowerCase().includes(params.cargo_num!.toLowerCase()));
  }
  if (params.status) {
    items = items.filter((a) => a.status === params.status);
  }
  if (params.statuses && params.statuses.length > 0) {
    items = items.filter((a) => params.statuses!.includes(a.status));
  }
  if (params.auc_type) {
    items = items.filter((a) => a.auc_type === params.auc_type);
  }
  if (params.load_city) {
    items = items.filter((a) => a.load_city === params.load_city);
  }
  if (params.unload_city) {
    items = items.filter((a) => a.unload_city === params.unload_city);
  }
  if (params.date_from) {
    items = items.filter((a) => a.load_date >= params.date_from!);
  }
  if (params.date_to) {
    items = items.filter((a) => a.load_date <= params.date_to!);
  }
  if (params.is_available !== null && params.is_available !== undefined) {
    items = items.filter((a) => a.can_set_bet === params.is_available);
  }
  if (params.is_bidder !== null && params.is_bidder !== undefined) {
    items = items.filter((a) => a.my_bet_exists === params.is_bidder);
  }
  if (params.price_from !== null && params.price_from !== undefined) {
    items = items.filter((a) => a.current_price >= params.price_from!);
  }
  if (params.price_to !== null && params.price_to !== undefined) {
    items = items.filter((a) => a.current_price <= params.price_to!);
  }

  const total = items.length;
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const data = items.slice(start, start + perPage);

  return { data, total, page, per_page: perPage, total_pages: totalPages };
}
