import { z } from 'zod';
import type { AuctionDetail } from '@/shared/api/types';

const baseSchema = z.object({
  price: z
    .number({ required_error: 'Цена обязательна', invalid_type_error: 'Введите число' })
    .positive('Цена должна быть больше 0'),
  comment: z.string().max(500, 'Комментарий не более 500 символов').optional().or(z.literal('')),
});

export type PlaceBetFormData = z.infer<typeof baseSchema>;

export function createPlaceBetSchema(auction: AuctionDetail) {
  const rules: Array<(val: number, ctx: z.RefinementCtx) => void> = [];

  if (auction.auc_type === 'Up') {
    rules.push((val, ctx) => {
      if (val <= auction.current_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: auction.current_price + 1,
          inclusive: false,
          type: 'number',
          message: `Цена должна быть больше текущей (${auction.current_price.toLocaleString('ru-RU')} ₽)`,
        });
      }
    });
  } else if (auction.auc_type === 'Down') {
    rules.push((val, ctx) => {
      if (val >= auction.current_price) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: auction.current_price - 1,
          inclusive: false,
          type: 'number',
          message: `Цена должна быть меньше текущей (${auction.current_price.toLocaleString('ru-RU')} ₽)`,
        });
      }
    });
  }

  if (auction.bet_step != null && (auction.auc_type === 'Up' || auction.auc_type === 'Down')) {
    rules.push((val, ctx) => {
      const diff = Math.abs(val - auction.current_price);
      if (diff > 0 && diff % auction.bet_step! !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Цена должна быть кратна шагу ${auction.bet_step!.toLocaleString('ru-RU')} ₽`,
        });
      }
    });
  }

  if (rules.length === 0) return baseSchema;

  return baseSchema.superRefine((data, ctx) => {
    for (const rule of rules) {
      rule(data.price, ctx);
    }
  });
}

export const placeBetSchema = baseSchema;