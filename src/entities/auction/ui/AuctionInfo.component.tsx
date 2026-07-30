import type { AuctionDetail } from '@/shared/api/types';
import { formatPrice, formatDateTime } from '../lib/mappers';
import { statusLabel, tradingLabel, statusBadgeClass, tradingBadgeClass } from '../lib/status';

interface Props {
  detail: AuctionDetail;
}

export function AuctionInfo({ detail }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        <Section title="Основная информация">
          <Row label="Номер заявки" value={detail.cargo_num} />
          <Row label="Статус" value={<StatusBadge status={detail.status} />} />
          <Row label="Ваш статус" value={<TradingBadge status={detail.user_trading_status} />} />
          <Row label="Создан" value={formatDateTime(detail.created_at)} />
        </Section>

        <Section title="Маршрут">
          <Row label="Погрузка" value={detail.load_city} />
          <Row label="Адрес" value={detail.hide_points_address_and_contacts ? 'Скрыт' : detail.load_address} />
          <Row label="Выгрузка" value={detail.unload_city} />
          {detail.unload_address && <Row label="Адрес" value={detail.hide_points_address_and_contacts ? 'Скрыт' : detail.unload_address} />}
          {detail.distance_km && <Row label="Расстояние" value={`${detail.distance_km} км`} />}
        </Section>

        <Section title="Груз">
          <Row label="Наименование" value={detail.hide_points_address_and_contacts ? '' : detail.cargo_name} />
          <Row label="Тип" value={detail.cargo_type} />
          <Row label="Вес" value={`${detail.cargo_weight_tonn} т`} />
          <Row label="Объём" value={detail.cargo_volume_m3 ? `${detail.cargo_volume_m3} м³` : '—'} />
          <Row label="Тип кузова" value={detail.body_type} />
          {detail.loading_type && <Row label="Тип погрузки" value={detail.loading_type} />}
          {!detail.no_view_cargo_price && <Row label="Цена видна" value="Да" />}
        </Section>

        <Section title="Организатор">
          <Row label="Компания" value={detail.organizer_name} />
          {detail.organizer_rating && <Row label="Рейтинг" value={`${detail.organizer_rating.toFixed(1)} ★`} />}
          {detail.contact_person && !detail.hide_points_address_and_contacts && (
            <Row label="Контакты" value={`${detail.contact_person}, ${detail.contact_phone ?? ''}`} />
          )}
          {detail.hide_points_address_and_contacts && <Row label="Контакты" value="Скрыты" />}
        </Section>

        <Section title="Финансы">
          <Row label="Текущая цена" value={formatPrice(detail.current_price)} />
          {detail.min_price != null && <Row label="Мин. цена" value={formatPrice(detail.min_price)} />}
          {detail.max_price != null && <Row label="Макс. цена" value={formatPrice(detail.max_price)} />}
          {detail.start_price != null && <Row label="Стартовая цена" value={formatPrice(detail.start_price)} />}
          {detail.bet_step != null && <Row label="Шаг ставки" value={formatPrice(detail.bet_step)} />}
          {detail.price_per_km != null && <Row label="Цена за км" value={formatPrice(detail.price_per_km)} />}
          <Row label="НДС" value={detail.vat_included ? 'Включён' : 'Не включён'} />
          <Row label="Валюта" value={detail.currency} />
        </Section>

        <Section title="Оплата">
          {detail.payment_term_days && <Row label="Срок оплаты" value={`${detail.payment_term_days} дн.`} />}
          {detail.payment_term_type && <Row label="Тип оплаты" value={detail.payment_term_type} />}
        </Section>

        <Section title="Даты">
          <Row label="Погрузка с" value={formatDateTime(detail.load_date_from)} />
          <Row label="Погрузка по" value={formatDateTime(detail.load_date_to)} />
          {detail.unload_date_from && <Row label="Выгрузка с" value={formatDateTime(detail.unload_date_from)} />}
          {detail.unload_date_to && <Row label="Выгрузка по" value={formatDateTime(detail.unload_date_to)} />}
        </Section>
      </div>

      {detail.description && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
          {detail.description}
        </div>
      )}

      <div className="mt-4 flex gap-2 text-xs text-gray-400">
        {detail.hide_bets_history && <span>🔒 История ставок скрыта</span>}
        {detail.hide_points_address_and_contacts && <span>🔒 Контакты и адреса скрыты</span>}
        {detail.no_view_cargo_price && <span>🔒 Цена груза скрыта</span>}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2 border-b border-gray-200 pb-1">{title}</h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-xs gap-2">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadgeClass(status)}`}>{statusLabel(status)}</span>;
}

function TradingBadge({ status }: { status: string }) {
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${tradingBadgeClass(status)}`}>{tradingLabel(status)}</span>;
}