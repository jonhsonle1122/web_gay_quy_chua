import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Calendar, Clock, MapPin } from 'lucide-react';
import { Campaign } from '@/types/campaign';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const percentConfirmed = Math.min(
    100,
    Math.round((campaign.confirmedAmount / campaign.targetAmount) * 100)
  );

  const percentPending = Math.min(
    100 - percentConfirmed,
    Math.round((campaign.pendingAmount / campaign.targetAmount) * 100)
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Cover Image & Badges */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-amber-100">
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-amber-900/85 px-3 py-1 text-[11px] font-semibold text-amber-100 backdrop-blur-xs">
            {campaign.typeLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-xs">
          <Clock className="h-3 w-3 text-amber-300" />
          <span>Còn {campaign.daysRemaining} ngày</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Temple Name & Verified badge */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-amber-900">
          <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span className="font-semibold text-amber-950 truncate">{campaign.temple.name}</span>
          {campaign.temple.isVerified && (
            <span className="flex items-center gap-0.5 text-emerald-600 shrink-0" title="Đã xác minh chính chủ">
              <ShieldCheck className="h-4 w-4 fill-emerald-100" />
            </span>
          )}
          <span className="text-amber-800/70 truncate">• {campaign.temple.province}</span>
        </div>

        {/* Campaign Title */}
        <Link href={`/su-kien/${campaign.slug}`}>
          <h3 className="line-clamp-2 font-bold text-amber-950 text-base leading-snug group-hover:text-amber-700 transition-colors">
            {campaign.title}
          </h3>
        </Link>

        {/* Progress Bar Section */}
        <div className="mt-4 flex-1">
          {/* Progress Multi-Bar */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-amber-100">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
              style={{ width: `${percentConfirmed}%` }}
              title={`Đã đối soát: ${percentConfirmed}%`}
            />
            {percentPending > 0 && (
              <div
                className="absolute top-0 h-full bg-amber-300/80 transition-all duration-500"
                style={{
                  left: `${percentConfirmed}%`,
                  width: `${percentPending}%`,
                }}
                title={`Đang chờ đối soát: ${percentPending}%`}
              />
            )}
          </div>

          {/* Amount Stats */}
          <div className="mt-2.5 flex items-baseline justify-between text-xs">
            <div>
              <span className="font-bold text-amber-950 text-sm">
                {campaign.confirmedAmount.toLocaleString('vi-VN')} đ
              </span>
              <span className="ml-1 text-amber-700 font-medium">({percentConfirmed}%)</span>
            </div>
            <div className="text-amber-800/80">
              Mục tiêu: <span className="font-medium text-amber-950">{campaign.targetAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          {campaign.pendingAmount > 0 && (
            <div className="mt-1 text-[11px] text-amber-700/80 italic">
              + {campaign.pendingAmount.toLocaleString('vi-VN')} đ đang chờ đối soát
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-amber-100">
          <Link
            href={`/su-kien/${campaign.slug}`}
            className="flex w-full items-center justify-center rounded-xl bg-amber-600 py-2.5 text-center text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors"
          >
            Cúng Dường & Xem Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
