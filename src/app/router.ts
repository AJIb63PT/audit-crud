import { createRouter as createTanstackRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { queryClient } from './App';
import { Layout } from '@/shared/ui/Layout.component';
import { AuctionsListPage } from '@/pages/auctions-list/ui/Page.component';
import { AuctionDetailPage } from '@/pages/auction-detail/ui/Page.component';
import { AuctionBetsPage } from '@/pages/auction-bets/ui/Page.component';
import { PlaceBetPage } from '@/features/place-bet/ui/PlaceBetForm.component';
import { api } from '@/shared/api/http-client';
import type { AuctionDetail } from '@/shared/api/types';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AuctionsListPage,
});

const auctionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid',
  component: AuctionDetailPage,
  loader: async ({ params }) => {
    const { auctionUuid } = params;
    const data = await queryClient.fetchQuery({
      queryKey: ['auction', auctionUuid],
      queryFn: () => api.get<AuctionDetail>(`/auctions/${auctionUuid}`),
    });
    return data;
  },
});

const auctionBetsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/bets',
  component: AuctionBetsPage,
});

const placeBetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auctions/$auctionUuid/place-bet',
  component: PlaceBetPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  auctionDetailRoute,
  auctionBetsRoute,
  placeBetRoute,
]);

export function createRouter() {
  return createTanstackRouter({ routeTree });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}