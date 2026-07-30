import { http, HttpResponse, type HttpHandler } from 'msw';
import { getAuction, getBets, addBet, filterAuctions } from './db';

export const handlers: HttpHandler[] = [
  http.post('*/auctions/list', async ({ request }) => {
    const body = await request.json().catch(() => ({}));
    const params = body as Record<string, unknown>;
    const result = filterAuctions({
      cargo_num: (params.cargo_num as string) ?? null,
      status: (params.status as string) ?? null,
      statuses: (params.statuses as string[]) ?? null,
      auc_type: (params.auc_type as string) ?? null,
      load_city: (params.load_city as string) ?? null,
      unload_city: (params.unload_city as string) ?? null,
      date_from: (params.date_from as string) ?? null,
      date_to: (params.date_to as string) ?? null,
      is_available: (params.is_available as boolean | null) ?? null,
      is_bidder: (params.is_bidder as boolean | null) ?? null,
      price_from: (params.price_from as number | null) ?? null,
      price_to: (params.price_to as number | null) ?? null,
      page: (params.page as number) ?? 1,
      per_page: (params.per_page as number) ?? 20,
    });
    return HttpResponse.json(result);
  }),

  http.get('*/auctions/:auctionUuid', async ({ params }) => {
    const { auctionUuid } = params;
    const auction = getAuction(auctionUuid as string);
    if (!auction) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(auction.detail);
  }),

  http.get('*/auctions/:auctionUuid/bets', async ({ params }) => {
    const { auctionUuid } = params;
    const auction = getAuction(auctionUuid as string);
    if (!auction) {
      return new HttpResponse(null, { status: 404 });
    }
    const bets = getBets(auctionUuid as string);
    return HttpResponse.json(bets);
  }),

  http.post('*/auctions/:auctionUuid/bets', async ({ params, request }) => {
    const { auctionUuid } = params;
    const auction = getAuction(auctionUuid as string);
    if (!auction) {
      return new HttpResponse(null, { status: 404 });
    }

    if (!auction.detail.can_set_bet) {
      return HttpResponse.json(
        { detail: [{ field: 'can_set_bet', message: 'Ставка недоступна для этого аукциона' }] },
        { status: 422 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { price?: number; comment?: string };

    if (!body.price || body.price <= 0) {
      return HttpResponse.json(
        { detail: [{ field: 'price', message: 'Цена должна быть больше 0' }] },
        { status: 422 }
      );
    }

    if (auction.detail.min_price != null && body.price < auction.detail.min_price) {
      return HttpResponse.json(
        { detail: [{ field: 'price', message: `Цена не может быть меньше ${auction.detail.min_price}` }] },
        { status: 422 }
      );
    }

    if (auction.detail.max_price != null && body.price > auction.detail.max_price) {
      return HttpResponse.json(
        { detail: [{ field: 'price', message: `Цена не может быть больше ${auction.detail.max_price}` }] },
        { status: 422 }
      );
    }

    if (auction.detail.auc_type === 'Up' && body.price <= auction.detail.current_price) {
      return HttpResponse.json(
        { detail: [{ field: 'price', message: `Цена должна быть больше текущей (${auction.detail.current_price} ₽)` }] },
        { status: 422 }
      );
    }

    if (auction.detail.auc_type === 'Down' && body.price >= auction.detail.current_price) {
      return HttpResponse.json(
        { detail: [{ field: 'price', message: `Цена должна быть меньше текущей (${auction.detail.current_price} ₽)` }] },
        { status: 422 }
      );
    }

    if (auction.detail.bet_step != null) {
      const diff = Math.abs(body.price - auction.detail.current_price);
      if (diff > 0 && diff % auction.detail.bet_step !== 0) {
        return HttpResponse.json(
          { detail: [{ field: 'price', message: `Цена должна быть кратна шагу ${auction.detail.bet_step} ₽` }] },
          { status: 422 }
        );
      }
    }

    const bet = addBet(auctionUuid as string, body.price, body.comment ?? null);
    return HttpResponse.json(bet);
  }),
];
