'use client';

import { useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Users,
  Building,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mock-campaigns';
import { BudgetTable } from '@/components/campaign/budget-table';
import { DonationModal } from '@/components/donation/donation-modal';

function CampaignDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const campaign = MOCK_CAMPAIGNS.find((c) => c.slug === slug) || MOCK_CAMPAIGNS[0];
  const [activeTab, setActiveTab] = useState<'ABOUT' | 'BUDGET' | 'DONORS' | 'REPORT'>('ABOUT');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  const percentConfirmed = Math.min(
    100,
    Math.round((campaign.confirmedAmount / campaign.targetAmount) * 100)
  );

  return (
    <div className="min-h-screen bg-stone-50 pb-28 sm:pb-20">
      {/* Back Link */}
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại trang chủ</span>
        </Link>
      </div>

      <div className="mx-auto mt-4 max-w-5xl px-4 sm:px-6 space-y-6">
        {/* Cover Image & Quick info */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden rounded-3xl border border-amber-200/80 shadow-md">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <span className="inline-block rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs mb-2">
              {campaign.typeLabel}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug">
              {campaign.title}
            </h1>
          </div>
        </div>

        {/* Temple Profile Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <img
              src={campaign.temple.avatarUrl}
              alt={campaign.temple.name}
              className="h-14 w-14 rounded-2xl object-cover border border-amber-300 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-amber-950 text-base sm:text-lg">
                  {campaign.temple.name}
                </h2>
                {campaign.temple.isVerified && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold text-xs" title="Đã đối chiếu giấy phép cơ sở tôn giáo">
                    <ShieldCheck className="h-4 w-4 fill-emerald-100" />
                    <span>Đã Xác Minh</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-800/90 mt-0.5">
                {campaign.temple.representativeName} • {campaign.temple.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              Tỷ lệ báo cáo: {campaign.temple.onTimeReportRate}% đúng hạn
            </span>
          </div>
        </div>

        {/* Progress & Target Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Stats Card */}
          <div className="lg:col-span-2 rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-amber-700 tracking-wider">
                  Tịnh tài đã đối soát ngân hàng
                </span>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1">
                  {campaign.confirmedAmount.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-amber-800/80">Mục tiêu dự trù</span>
                <div className="text-lg font-bold text-amber-900">
                  {campaign.targetAmount.toLocaleString('vi-VN')} đ
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-amber-100">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                style={{ width: `${percentConfirmed}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-amber-800">
              <span className="font-bold text-amber-900">Đạt {percentConfirmed}% mục tiêu</span>
              {campaign.pendingAmount > 0 && (
                <span className="text-amber-700">
                  Đang đối soát: +{campaign.pendingAmount.toLocaleString('vi-VN')} đ
                </span>
              )}
              <span className="flex items-center gap-1 font-semibold text-amber-900">
                <Clock className="h-3.5 w-3.5" />
                Còn {campaign.daysRemaining} ngày đóng quỹ
              </span>
            </div>

            {/* Surplus Policy Banner */}
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Cam kết xử lý tiền dư: </span>
                {campaign.surplusPolicyLabel}.
              </div>
            </div>
          </div>

          {/* Direct Donation Action Box (Desktop & Tablet) */}
          <div className="rounded-3xl border-2 border-amber-500/80 bg-gradient-to-b from-amber-50 to-orange-50/40 p-6 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-2">
                <Heart className="h-4 w-4 fill-amber-600 text-amber-600" />
                <span>Gieo Duyên Cúng Dường</span>
              </div>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                Tạo mã VietQR động để chuyển khoản trực tiếp vào STK chính thức của Chùa An Lạc tại Ngân hàng MB.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 py-4 font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition-all text-sm"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>Cúng Dường Ngay (VietQR)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Navigation Tabs */}
        <div className="flex border-b border-amber-200 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ABOUT')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ABOUT'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-amber-800/70 hover:text-amber-900'
            }`}
          >
            Ý Nghĩa & Thông Tin Buổi Lễ
          </button>
          <button
            onClick={() => setActiveTab('BUDGET')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'BUDGET'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-amber-800/70 hover:text-amber-900'
            }`}
          >
            Bảng Dự Trù Chi Phí ({campaign.budgetItems.length} mục)
          </button>
          <button
            onClick={() => setActiveTab('DONORS')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'DONORS'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-amber-800/70 hover:text-amber-900'
            }`}
          >
            Danh Sách Cúng Dường ({campaign.donations.length})
          </button>
          <button
            onClick={() => setActiveTab('REPORT')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'REPORT'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-amber-800/70 hover:text-amber-900'
            }`}
          >
            Báo Cáo Thu - Chi Sau Lễ
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'ABOUT' && (
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-6">
              {/* Event Specific Info pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3">
                  <span className="text-[11px] text-amber-800 block">Ngày diễn ra lễ</span>
                  <span className="font-bold text-amber-950 text-xs sm:text-sm">
                    {campaign.eventDate}
                  </span>
                </div>
                {campaign.monksCount && (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3">
                    <span className="text-[11px] text-amber-800 block">Số lượng Chư Tăng Ni</span>
                    <span className="font-bold text-amber-950 text-xs sm:text-sm">
                      {campaign.monksCount} vị quang lâm
                    </span>
                  </div>
                )}
                {campaign.robesCount && (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3">
                    <span className="text-[11px] text-amber-800 block">Số lượng y dâng</span>
                    <span className="font-bold text-amber-950 text-xs sm:text-sm">
                      {campaign.robesCount} bộ Y Ka-thi-na
                    </span>
                  </div>
                )}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-3">
                  <span className="text-[11px] text-amber-800 block">Địa điểm tổ chức</span>
                  <span className="font-bold text-amber-950 text-xs sm:text-sm truncate block">
                    {campaign.temple.address}
                  </span>
                </div>
              </div>

              {/* Description Body */}
              <div className="prose prose-amber max-w-none text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-line">
                {campaign.description}
              </div>
            </div>
          )}

          {activeTab === 'BUDGET' && (
            <BudgetTable
              items={campaign.budgetItems}
              targetAmount={campaign.targetAmount}
            />
          )}

          {activeTab === 'DONORS' && (
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                  Danh Sách Thập Phương Cúng Dường
                </h3>
                <span className="text-xs text-amber-800">
                  Cập nhật thời gian thực qua Webhook
                </span>
              </div>

              {campaign.donations.length > 0 ? (
                <div className="divide-y divide-amber-100">
                  {campaign.donations.map((d) => (
                    <div key={d.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-950 text-xs sm:text-sm">
                            {d.isAnonymous ? 'Phật tử Ẩn Danh' : d.donorName}
                          </span>
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-800">
                            {d.donationCode}
                          </span>
                        </div>
                        {d.prayerMessage && (
                          <p className="mt-1 text-xs text-amber-800/90 italic">
                            "{d.prayerMessage}"
                          </p>
                        )}
                        <span className="text-[10px] text-amber-700/70 mt-1 block">
                          {d.confirmedAt} • Khớp đối soát ngân hàng
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-amber-900 text-xs sm:text-sm">
                          {d.isAmountHidden ? '•••••• đ' : `${d.amount.toLocaleString('vi-VN')} đ`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-xs text-amber-800/80">
                  Chưa có lượt cúng dường nào. Hãy là người đầu tiên gieo duyên phước lành!
                </p>
              )}
            </div>
          )}

          {activeTab === 'REPORT' && (
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm sm:text-base">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Khu Vực Báo Cáo Thu - Chi Sau Lễ</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Theo quy định nghiêm ngặt của nền tảng, trong vòng 7 ngày sau ngày diễn ra đại lễ ({campaign.eventDate}), Chùa bắt buộc phải nộp bảng đối chiếu thu chi thực tế, kèm hình ảnh hóa đơn chứng từ và link video livestream buổi lễ.
              </p>

              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs text-amber-900">
                <div className="font-bold mb-1">Quy định xử phạt minh bạch:</div>
                <ul className="list-disc list-inside space-y-1 text-amber-800/90">
                  <li>Sau 7 ngày chưa có báo cáo: Hệ thống tự động khóa quyền mở sự kiện mới.</li>
                  <li>Sau 30 ngày quá hạn: Hồ sơ chùa sẽ bị gắn cờ cảnh báo công khai toàn nền tảng.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-amber-200 bg-white/95 p-3.5 backdrop-blur-md lg:hidden shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-amber-800 block">Đã đối soát</span>
            <span className="font-bold text-amber-950 text-sm">
              {campaign.confirmedAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>
          <button
            onClick={() => setIsDonationModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-amber-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-700"
          >
            <Heart className="h-4 w-4 fill-white" />
            <span>Cúng Dường Ngay</span>
          </button>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        campaign={campaign}
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
}

export default function CampaignDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-amber-800">Đang tải chi tiết sự kiện...</div>}>
      <CampaignDetailContent />
    </Suspense>
  );
}
