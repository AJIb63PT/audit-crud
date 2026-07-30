import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { api } from '@/shared/api/http-client';
import type { AuctionDetail } from '@/shared/api/types';
import { AuctionInfo } from '@/entities/auction/ui/AuctionInfo.component';
import { Spinner } from '@/shared/ui/Spinner.component';
import { ErrorState } from '@/shared/ui/ErrorState.component';

export function AuctionDetailPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid' });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auction', auctionUuid],
    queryFn: () => api.get<AuctionDetail>(`/auctions/${auctionUuid}`),
    enabled: !!auctionUuid,
  });

  if (isLoading) {
    return <div className="flex justify-center p-10"><Spinner size={40} /></div>;
  }

  if (isError || !data) {
    return <ErrorState message="Аукцион не найден" />;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link to="/" className="text-blue-600 no-underline text-sm">← Назад к списку</Link>
        <span className="text-gray-400">/</span>
        <span className="text-xl font-bold text-[#1e3a5f]">{data.cargo_num}</span>
      </div>

      <AuctionInfo detail={data} />

      <div className="flex gap-3 mt-4 flex-wrap">
        {data.can_set_bet && (
          <Link
            to="/auctions/$auctionUuid/place-bet"
            params={{ auctionUuid }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg no-underline font-semibold text-sm"
          >
            Сделать ставку
          </Link>
        )}
        {data.my_bet_exists && data.can_set_bet && (
          <Link
            to="/auctions/$auctionUuid/place-bet"
            params={{ auctionUuid }}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg no-underline font-semibold text-sm"
          >
            Изменить ставку
          </Link>
        )}
        {!data.hide_bets_history && (
          <Link
            to="/auctions/$auctionUuid/bets"
            params={{ auctionUuid }}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg no-underline font-semibold text-sm border border-gray-300"
          >
            Смотреть ставки
          </Link>
        )}
      </div>

      {data.my_bet && (
        <div className="mt-4 bg-green-50 rounded-xl p-4 border border-green-200">
          <div className="text-sm font-semibold text-green-600 mb-2">Ваша ставка</div>
          <div className="text-xs">
            <div>Цена: {data.my_bet.price.toLocaleString('ru-RU')} ₽</div>
            {data.my_bet.comment && <div>Комментарий: {data.my_bet.comment}</div>}
            <div>Статус: {data.my_bet.status}</div>
          </div>
        </div>
      )}
    </div>
  );
}
