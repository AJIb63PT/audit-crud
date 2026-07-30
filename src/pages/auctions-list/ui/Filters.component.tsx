import { useCallback, useState } from 'react';
import { AuctionType, AuctionStatus } from '@/shared/api/types';
import { CITIES } from '@/shared/api/mocks/cities';

interface FilterValues {
  cargo_num: string;
  status: string;
  statuses: string[];
  auc_type: string;
  load_city: string;
  unload_city: string;
  date_from: string;
  date_to: string;
  is_available: boolean;
  is_bidder: boolean;
  price_from: string;
  price_to: string;
}

interface Props {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
}

const STATUSES = Object.values(AuctionStatus);
const TYPES = Object.values(AuctionType);

export function Filters({ values, onChange }: Props) {
  const [local, setLocal] = useState<FilterValues>(values);
  const [expanded, setExpanded] = useState(false);

  const update = useCallback((patch: Partial<FilterValues>) => {
    const next = { ...local, ...patch };
    setLocal(next);
    onChange(next);
  }, [local, onChange]);

  const toggleStatus = (s: string) => {
    const has = local.statuses.includes(s);
    const next = has ? local.statuses.filter((x) => x !== s) : [...local.statuses, s];
    update({ statuses: next });
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
      <div className={`flex justify-between items-center ${expanded ? 'mb-3' : ''}`}>
        <h3 className="text-base font-semibold text-[#1e3a5f] m-0">Фильтры</h3>
        <button onClick={() => setExpanded(!expanded)} className="bg-transparent border-none text-blue-600 cursor-pointer text-sm">
          {expanded ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
            <Field label="Номер заявки">
              <input value={local.cargo_num} onChange={(e) => setLocal({ ...local, cargo_num: e.target.value })} placeholder="CARGO-0001" className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border" />
            </Field>
            <Field label="Тип аукциона">
              <select value={local.auc_type} onChange={(e) => update({ auc_type: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border">
                <option value="">Все</option>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Город погрузки">
              <select value={local.load_city} onChange={(e) => update({ load_city: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border">
                <option value="">Все</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Город разгрузки">
              <select value={local.unload_city} onChange={(e) => update({ unload_city: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border">
                <option value="">Все</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Дата от">
              <input type="date" value={local.date_from} onChange={(e) => update({ date_from: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border" />
            </Field>
            <Field label="Дата до">
              <input type="date" value={local.date_to} onChange={(e) => update({ date_to: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border" />
            </Field>
            <Field label="Цена от">
              <input type="number" value={local.price_from} onChange={(e) => update({ price_from: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border" />
            </Field>
            <Field label="Цена до">
              <input type="number" value={local.price_to} onChange={(e) => update({ price_to: e.target.value })} className="px-2.5 py-1.5 rounded border border-gray-300 text-xs outline-none w-full box-border" />
            </Field>
          </div>

          <div>
            <div className="text-xs font-semibold text-gray-700 mb-1.5">Статус</div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleStatus(s)}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer border ${
                    local.statuses.includes(s)
                      ? 'bg-blue-100 text-blue-600 border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={local.is_available} onChange={(e) => update({ is_available: e.target.checked })} />
              Только доступные
            </label>
            <label className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={local.is_bidder} onChange={(e) => update({ is_bidder: e.target.checked })} />
              Только мои ставки
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={() => update({ cargo_num: '', status: '', statuses: [], auc_type: '', load_city: '', unload_city: '', date_from: '', date_to: '', is_available: false, is_bidder: false, price_from: '', price_to: '' })} className="px-4 py-2 rounded-lg border border-gray-300 bg-white cursor-pointer text-xs">
              Сбросить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}
