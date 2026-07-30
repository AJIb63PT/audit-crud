import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { z } from 'zod';
import { api } from '@/shared/api/http-client';
import type { PaginatedResponse, AuctionListItem } from '@/shared/api/types';
import { toAuctionCard } from '@/entities/auction/lib/mappers';
import { AuctionCard } from '@/entities/auction/ui/AuctionCard.component';
import { Filters } from './Filters.component';
import { Skeleton } from './Skeleton.component';
import { EmptyState } from './EmptyState.component';
import { ErrorState } from '@/shared/ui/ErrorState.component';

const searchSchema = z.object({
  cargo_num: z.string().optional().default(''),
  status: z.string().optional().default(''),
  statuses: z.array(z.string()).optional().default([]),
  auc_type: z.string().optional().default(''),
  load_city: z.string().optional().default(''),
  unload_city: z.string().optional().default(''),
  date_from: z.string().optional().default(''),
  date_to: z.string().optional().default(''),
  is_available: z.boolean().optional().default(false),
  is_bidder: z.boolean().optional().default(false),
  price_from: z.string().optional().default(''),
  price_to: z.string().optional().default(''),
  page: z.number().optional().default(1),
});

type SearchParams = z.infer<typeof searchSchema>;

function parseSearchParams(params: Record<string, unknown>): SearchParams {
  const parsed = searchSchema.safeParse({
    ...params,
    page: params.page ? Number(params.page) : 1,
    statuses: Array.isArray(params.statuses) ? params.statuses : [],
    is_available: params.is_available === true || params.is_available === 'true',
    is_bidder: params.is_bidder === true || params.is_bidder === 'true',
  });
  return parsed.success ? parsed.data : searchSchema.parse({});
}

export function AuctionsListPage() {
  const queryClient = useQueryClient();
  const search = useSearch({ from: '/' }) as Record<string, unknown>;
  const navigate = useNavigate({ from: '/' });

  const filters = parseSearchParams(search);

  const setFilters = useCallback((values: Record<string, string | string[] | boolean>) => {
    navigate({ search: { ...filters, ...values, page: values.page ?? 1 } as Record<string, unknown>, replace: true });
  }, [navigate, filters]);

  const setPage = useCallback((page: number) => {
    navigate({ search: { ...filters, page } as unknown as Record<string, unknown>, replace: true });
  }, [navigate, filters]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auctions', filters],
    queryFn: () => api.post<PaginatedResponse<AuctionListItem>>('/auctions/list', {
      cargo_num: filters.cargo_num || null,
      status: filters.status || null,
      statuses: filters.statuses?.length ? filters.statuses : null,
      auc_type: filters.auc_type || null,
      load_city: filters.load_city || null,
      unload_city: filters.unload_city || null,
      date_from: filters.date_from || null,
      date_to: filters.date_to || null,
      is_available: filters.is_available || null,
      is_bidder: filters.is_bidder || null,
      price_from: filters.price_from ? Number(filters.price_from) : null,
      price_to: filters.price_to ? Number(filters.price_to) : null,
      page: filters.page,
      per_page: 20,
    }),
  });

  const handlePrefetch = useCallback((uuid: string) => {
    queryClient.prefetchQuery({
      queryKey: ['auction', uuid],
      queryFn: () => api.get(`/auctions/${uuid}`),
    });
  }, [queryClient]);

  const filterValues = {
    cargo_num: filters.cargo_num,
    status: filters.status,
    statuses: filters.statuses,
    auc_type: filters.auc_type,
    load_city: filters.load_city,
    unload_city: filters.unload_city,
    date_from: filters.date_from,
    date_to: filters.date_to,
    is_available: filters.is_available,
    is_bidder: filters.is_bidder,
    price_from: filters.price_from,
    price_to: filters.price_to,
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-[#1e3a5f] mb-1">Список аукционов</h1>
      <p className="text-sm text-gray-500 mb-4">Найдите подходящий груз для перевозки</p>

      <Filters values={filterValues} onChange={(v) => setFilters(v as unknown as Record<string, string | string[] | boolean>)} />

      {isLoading && <Skeleton />}
      {isError && <ErrorState />}
      {!isLoading && !isError && data && data.data.length === 0 && <EmptyState />}
      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="flex flex-col gap-3">
            {data.data.map((item) => (
              <div key={item.uuid} onMouseEnter={() => handlePrefetch(item.uuid)}>
                <AuctionCard auction={toAuctionCard(item)} />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-5">
            <button
              disabled={filters.page <= 1}
              onClick={() => setPage(filters.page - 1)}
              className={`px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs ${
                filters.page > 1 ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'
              }`}
            >
              ← Назад
            </button>
            <span className="text-sm text-gray-700">
              {data.page} / {data.total_pages}
            </span>
            <button
              disabled={filters.page >= data.total_pages}
              onClick={() => setPage(filters.page + 1)}
              className={`px-4 py-2 rounded-lg border border-gray-300 bg-white text-xs ${
                filters.page < data.total_pages ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'
              }`}
            >
              Вперед →
            </button>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            Всего: {data.total}
          </div>
        </>
      )}
    </div>
  );
}
