import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/http-client';
import type { AuctionBet, AuctionDetail } from '@/shared/api/types';
import { useUiStore } from '@/shared/store/ui-store';

export function usePlaceBet(auctionUuid: string) {
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: { price: number; comment?: string }) =>
      api.post<AuctionBet>(`/auctions/${auctionUuid}/bets`, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['auction', auctionUuid] });
      await queryClient.cancelQueries({ queryKey: ['bets', auctionUuid] });
      await queryClient.cancelQueries({ queryKey: ['auctions'] });

      const prevAuction = queryClient.getQueryData<AuctionDetail>(['auction', auctionUuid]);
      const prevBets = queryClient.getQueryData<AuctionBet[]>(['bets', auctionUuid]);

      if (prevAuction) {
        queryClient.setQueryData<AuctionDetail>(['auction', auctionUuid], {
          ...prevAuction,
          current_price: data.price,
          my_bet_exists: true,
          can_set_bet: false,
          user_trading_status: prevAuction.auc_type === 'Down' ? 'Losing' : 'Leading',
        });
      }

      return { prevAuction, prevBets };
    },
    onError: (_err, _data, context) => {
      if (context?.prevAuction) {
        queryClient.setQueryData(['auction', auctionUuid], context.prevAuction);
      }
      if (context?.prevBets) {
        queryClient.setQueryData(['bets', auctionUuid], context.prevBets);
      }
      const error = _err as { status?: number; body?: { detail?: Array<{ field: string; message: string }> } };
      const message = error?.body?.detail?.[0]?.message ?? 'Ошибка при размещении ставки';
      addToast(message, 'error');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', auctionUuid] });
      queryClient.invalidateQueries({ queryKey: ['bets', auctionUuid] });
      addToast('Ставка успешно размещена!', 'success');
    },
  });
}