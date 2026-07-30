import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/http-client';
import type { AuctionBet } from '@/shared/api/types';
import { useUiStore } from '@/shared/store/ui-store';

export function usePlaceBet(auctionUuid: string) {
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  return useMutation({
    mutationFn: (data: { price: number; comment?: string }) =>
      api.post<AuctionBet>(`/auctions/${auctionUuid}/bets`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['auction', auctionUuid] });
      queryClient.invalidateQueries({ queryKey: ['bets', auctionUuid] });
      addToast('Ставка успешно размещена!', 'success');
    },
    onError: (err: unknown) => {
      const error = err as { status?: number; body?: { detail?: Array<{ field: string; message: string }> } };
      const message = error?.body?.detail?.[0]?.message ?? 'Ошибка при размещении ставки';
      addToast(message, 'error');
    },
  });
}
