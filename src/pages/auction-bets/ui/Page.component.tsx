import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { api } from '@/shared/api/http-client';
import type { AuctionBet, AuctionDetail } from '@/shared/api/types';
import { Spinner } from '@/shared/ui/Spinner.component';
import { ErrorState } from '@/shared/ui/ErrorState.component';

export function AuctionBetsPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/bets' });

  const { data: bets, isLoading: betsLoading, isError: betsError } = useQuery({
    queryKey: ['bets', auctionUuid],
    queryFn: () => api.get<AuctionBet[]>(`/auctions/${auctionUuid}/bets`),
    enabled: !!auctionUuid,
  });

  const { data: auction } = useQuery({
    queryKey: ['auction', auctionUuid],
    queryFn: () => api.get<AuctionDetail>(`/auctions/${auctionUuid}`),
    enabled: !!auctionUuid,
  });

  if (betsLoading) {
    return <div className="flex justify-center p-10"><Spinner size={40} /></div>;
  }

  if (betsError) {
    return <ErrorState message="Ошибка загрузки ставок" />;
  }

  if (auction?.hide_bets_history) {
    return (
      <div>
        <Link to="/auctions/$auctionUuid" params={{ auctionUuid }} className="text-blue-600 no-underline text-sm inline-block mb-4">← Назад к аукциону</Link>
        <div className="text-center py-16 px-5 text-gray-500">
          <div className="text-5xl mb-3">🔒</div>
          <div className="text-lg font-semibold mb-2">История ставок скрыта</div>
          <div className="text-sm">Организатор скрыл историю ставок для этого аукциона</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Link to="/auctions/$auctionUuid" params={{ auctionUuid }} className="text-blue-600 no-underline text-sm">← Назад к аукциону</Link>
        <span className="text-gray-400">/</span>
        <span className="text-xl font-bold text-[#1e3a5f]">Ставки</span>
      </div>

      {bets && bets.length === 0 ? (
        <div className="text-center py-16 px-5 text-gray-500">
          <div className="text-5xl mb-3">📭</div>
          <div className="text-lg font-semibold mb-2">Ставок пока нет</div>
          <div className="text-sm">Будьте первым, кто сделает ставку</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-500 mb-2">
            Участников: {bets?.length ?? 0}
          </div>
          {bets?.map((bet) => (
            <BetCard key={bet.uuid} bet={bet} />
          ))}
        </div>
      )}
    </div>
  );
}

function BetCard({ bet }: { bet: AuctionBet }) {
  return (
    <div className={`rounded-xl p-4 border ${
      bet.is_mine ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
    }`}>
      <div className="flex justify-between items-start flex-wrap gap-2">
        <div>
          <div className="font-semibold text-base text-[#1e3a5f]">
            {bet.is_mine ? 'Ваша ставка' : bet.carrier_name}
            {bet.is_winner && <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[11px] font-semibold">Победитель</span>}
          </div>
          {bet.carrier_rating && <div className="text-xs text-gray-400">Рейтинг: {bet.carrier_rating.toFixed(1)} ★</div>}
          {bet.rank && <div className="text-xs text-gray-400">Место: {bet.rank}</div>}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[#1e3a5f]">{bet.price.toLocaleString('ru-RU')} ₽</div>
          {bet.price_with_vat && <div className="text-xs text-gray-400">С НДС: {bet.price_with_vat.toLocaleString('ru-RU')} ₽</div>}
          {bet.price_without_vat && <div className="text-xs text-gray-400">Без НДС: {bet.price_without_vat.toLocaleString('ru-RU')} ₽</div>}
        </div>
      </div>

      {bet.comment && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
          {bet.comment}
        </div>
      )}

      {bet.status === 'Cancelled' && (
        <div className="mt-2 px-3 py-1.5 bg-red-50 rounded text-xs text-red-600">
          Отменена{bet.cancel_reason ? `: ${bet.cancel_reason}` : ''}
        </div>
      )}

      <div className="mt-2 text-[11px] text-gray-400">
        {new Date(bet.created_at).toLocaleString('ru-RU')}
      </div>
    </div>
  );
}
