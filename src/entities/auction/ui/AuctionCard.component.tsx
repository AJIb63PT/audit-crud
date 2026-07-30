import { memo } from 'react';
import { Link } from '@tanstack/react-router';
import type { AuctionCardVM } from '../lib/mappers';
import { statusClass, tradingBadgeClass } from '../lib/status';

interface Props {
  auction: AuctionCardVM;
}

export const AuctionCard = memo(function AuctionCard({ auction }: Props) {
  return (
    <Link
      to="/auctions/$auctionUuid"
      params={{ auctionUuid: auction.uuid }}
      className="no-underline text-inherit"
    >
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">{auction.cargoNum}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${auction.isFixPrice ? 'bg-blue-100' : 'bg-amber-100'}`}>
              {auction.typeLabel}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className={`text-xs font-semibold ${statusClass(auction.statusKey)}`}>{auction.statusLabel}</span>
            {auction.tradingLabel !== '—' && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${tradingBadgeClass(auction.tradingStatusKey)}`}>
                {auction.tradingLabel}
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="font-semibold text-base text-[#1e3a5f] mb-1">{auction.route}</div>
          <div className="text-xs text-gray-500">
            {auction.loadDate}{auction.unloadDate ? ` — ${auction.unloadDate}` : ''}
          </div>
        </div>

        <div className="flex gap-1 mb-3 flex-wrap">
          <Tag>{auction.cargoName}</Tag>
          <Tag>{auction.weight}</Tag>
          {auction.volume && <Tag>{auction.volume}</Tag>}
          <Tag>{auction.bodyType}</Tag>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <div className="text-xl font-bold text-[#1e3a5f]">{auction.currentPrice}</div>
            <div className="text-xs text-gray-400">
              {auction.pricePerKm}{auction.betStep ? ` · шаг ${auction.betStep}` : ''}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {auction.myBetExists && <span className="text-xs text-green-600 font-semibold">✓ Моя ставка</span>}
            {auction.canSetBet && (
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold">
                Сделать ставку
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

function Tag({ children }: { children: string }) {
  return <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{children}</span>;
}