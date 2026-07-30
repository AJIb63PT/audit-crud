import { z } from 'zod';

export const placeBetSchema = z.object({
  price: z
    .number({ required_error: 'Цена обязательна', invalid_type_error: 'Введите число' })
    .positive('Цена должна быть больше 0'),
  comment: z.string().max(500, 'Комментарий не более 500 символов').optional().or(z.literal('')),
});

export type PlaceBetFormData = z.infer<typeof placeBetSchema>;
