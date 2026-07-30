export const AuctionType = {
  Request: 'Request',
  Up: 'Up',
  Down: 'Down',
  FixPrice: 'FixPrice',
} as const;
export type AuctionType = (typeof AuctionType)[keyof typeof AuctionType];

export const AuctionStatus = {
  Active: 'Active',
  Finished: 'Finished',
  Cancelled: 'Cancelled',
  Draft: 'Draft',
} as const;
export type AuctionStatus = (typeof AuctionStatus)[keyof typeof AuctionStatus];

export const UserTradingStatus = {
  None: 'None',
  Leading: 'Leading',
  Losing: 'Losing',
  Winner: 'Winner',
  Outbid: 'Outbid',
} as const;
export type UserTradingStatus = (typeof UserTradingStatus)[keyof typeof UserTradingStatus];

export const BetStatus = {
  Active: 'Active',
  Won: 'Won',
  Lost: 'Lost',
  Cancelled: 'Cancelled',
} as const;
export type BetStatus = (typeof BetStatus)[keyof typeof BetStatus];

export interface AuctionFilterParams {
  cargo_num?: string | null;
  status?: AuctionStatus | null;
  statuses?: AuctionStatus[] | null;
  auc_type?: AuctionType | null;
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
}

export interface PaginatedResponse<T = AuctionListItem> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface AuctionListItem {
  uuid: string;
  cargo_num: string;
  auc_type: AuctionType;
  status: AuctionStatus;
  user_trading_status: UserTradingStatus;
  load_city: string;
  unload_city: string;
  load_date: string;
  unload_date?: string | null;
  cargo_name: string;
  cargo_weight_tonn: number;
  cargo_volume_m3?: number | null;
  body_type: string;
  current_price: number;
  price_per_km?: number | null;
  bet_step?: number | null;
  my_bet_exists: boolean;
  can_set_bet: boolean;
  created_at: string;
}

export interface AuctionDetail extends AuctionListItem {
  description?: string | null;
  organizer_name: string;
  organizer_rating?: number | null;
  contact_person?: string | null;
  contact_phone?: string | null;
  load_address: string;
  unload_address?: string | null;
  load_date_from: string;
  load_date_to: string;
  unload_date_from?: string | null;
  unload_date_to?: string | null;
  cargo_type: string;
  loading_type?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  start_price?: number | null;
  currency: string;
  vat_included: boolean;
  payment_term_days?: number | null;
  payment_term_type?: string | null;
  can_set_bet: boolean;
  hide_bets_history: boolean;
  hide_points_address_and_contacts: boolean;
  no_view_cargo_price: boolean;
  distance_km?: number | null;
  my_bet?: AuctionBet | null;
}

export interface AuctionBet {
  uuid: string;
  auction_uuid: string;
  carrier_name: string;
  carrier_rating?: number | null;
  price: number;
  price_with_vat?: number | null;
  price_without_vat?: number | null;
  comment?: string | null;
  status: BetStatus;
  cancel_reason?: string | null;
  is_winner: boolean;
  is_mine: boolean;
  rank?: number | null;
  created_at: string;
}

export interface PlaceBetRequest {
  price: number;
  comment?: string | null;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export interface ValidationError {
  detail: ValidationErrorDetail[];
}
