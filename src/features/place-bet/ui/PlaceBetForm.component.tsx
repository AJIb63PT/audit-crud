import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams, useRouter } from '@tanstack/react-router';
import { api } from '@/shared/api/http-client';
import type { AuctionDetail } from '@/shared/api/types';
import { Spinner } from '@/shared/ui/Spinner.component';
import { useUiStore } from '@/shared/store/ui-store';
import { createPlaceBetSchema, type PlaceBetFormData } from '../lib/schema';
import { usePlaceBet } from '../api/usePlaceBet';

export function PlaceBetPage() {
  const { auctionUuid } = useParams({ from: '/auctions/$auctionUuid/place-bet' });
  const router = useRouter();
  const addToast = useUiStore((s) => s.addToast);

  const { data: auction, isLoading } = useQuery({
    queryKey: ['auction', auctionUuid],
    queryFn: () => api.get<AuctionDetail>(`/auctions/${auctionUuid}`),
    enabled: !!auctionUuid,
  });

  const mutation = usePlaceBet(auctionUuid);

  const betSchema = auction ? createPlaceBetSchema(auction) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlaceBetFormData>({
    resolver: betSchema ? zodResolver(betSchema) : undefined,
    defaultValues: {
      price: auction?.current_price ?? 0,
      comment: '',
    },
  });

  const onFormError = (formErrors: Record<string, { message?: string }>) => {
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      addToast(firstError.message, 'error');
    } else {
      addToast('Проверьте правильность заполнения формы', 'error');
    }
  };

  const onSubmit = (data: PlaceBetFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        addToast('Ставка успешно размещена!', 'success');
        router.navigate({ to: '/auctions/$auctionUuid', params: { auctionUuid } });
      },
      onError: (err: unknown) => {
        const error = err as { status?: number; body?: { detail?: Array<{ field: string; message: string }> } };
        const message = error?.body?.detail?.[0]?.message ?? 'Ошибка при размещении ставки';
        addToast(message, 'error');
      },
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-10"><Spinner size={40} /></div>;
  }

  if (!auction) {
    return <div className="text-center p-10 text-red-600">Аукцион не найден</div>;
  }

  if (!auction.can_set_bet) {
    return (
      <div>
        <Link to="/auctions/$auctionUuid" params={{ auctionUuid }} className="text-blue-600 no-underline text-sm inline-block mb-4">← Назад к аукциону</Link>
        <div className="text-center py-16 px-5 text-gray-500">
          <div className="text-5xl mb-3">🚫</div>
          <div className="text-lg font-semibold mb-2">Ставка недоступна</div>
          <div className="text-sm">Для этого аукциона нельзя сделать ставку</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Link to="/auctions/$auctionUuid" params={{ auctionUuid }} className="text-blue-600 no-underline text-sm">← Назад к аукциону</Link>
        <span className="text-gray-400">/</span>
        <span className="text-xl font-bold text-[#1e3a5f]">Разместить ставку</span>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-[480px]">
        <div className="mb-5">
          <div className="text-sm text-gray-500 mb-1">Аукцион</div>
          <div className="font-semibold">{auction.cargo_num} · {auction.load_city} → {auction.unload_city}</div>
          <div className="text-xs text-gray-700 mt-1">Текущая цена: {auction.current_price.toLocaleString('ru-RU')} ₽</div>
          {auction.min_price != null && <div className="text-xs text-gray-500">Мин. цена: {auction.min_price.toLocaleString('ru-RU')} ₽</div>}
          {auction.max_price != null && <div className="text-xs text-gray-500">Макс. цена: {auction.max_price.toLocaleString('ru-RU')} ₽</div>}
          {auction.bet_step != null && <div className="text-xs text-gray-500">Шаг ставки: {auction.bet_step.toLocaleString('ru-RU')} ₽</div>}
        </div>

        <form onSubmit={handleSubmit(onSubmit, onFormError)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Цена (₽) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className={`w-full px-3 py-2.5 rounded-lg text-base font-semibold border box-border ${
                errors.price ? 'border-red-600' : 'border-gray-300'
              }`}
            />
            {errors.price && <div className="text-red-600 text-xs mt-1">{errors.price.message}</div>}
            <div className="text-[11px] text-gray-400 mt-1">
              {auction.min_price != null && auction.max_price != null
                ? `Диапазон: ${auction.min_price.toLocaleString('ru-RU')} – ${auction.max_price.toLocaleString('ru-RU')} ₽`
                : auction.min_price != null
                  ? `Минимальная цена: ${auction.min_price.toLocaleString('ru-RU')} ₽`
                  : auction.max_price != null
                    ? `Максимальная цена: ${auction.max_price.toLocaleString('ru-RU')} ₽`
                    : ''}
              {auction.bet_step != null && ` · Шаг: ${auction.bet_step.toLocaleString('ru-RU')} ₽`}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Комментарий
            </label>
            <textarea
              {...register('comment')}
              rows={3}
              placeholder="Дополнительная информация (необязательно)"
              className={`w-full px-3 py-2.5 rounded-lg text-sm border box-border resize-y ${
                errors.comment ? 'border-red-600' : 'border-gray-300'
              }`}
            />
            {errors.comment && <div className="text-red-600 text-xs mt-1">{errors.comment.message}</div>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`px-6 py-3 text-white border-none rounded-lg font-semibold text-base ${
              mutation.isPending ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 cursor-pointer'
            }`}
          >
            {mutation.isPending ? 'Отправка...' : 'Разместить ставку'}
          </button>
        </form>
      </div>
    </div>
  );
}
