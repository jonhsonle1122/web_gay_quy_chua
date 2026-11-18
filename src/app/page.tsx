'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, HeartHandshake, Sparkles, Building2 } from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mock-campaigns';
import { CampaignCard } from '@/components/campaign/campaign-card';
import { CampaignType } from '@/types/campaign';

const CATEGORIES: { label: string; value: 'ALL' | CampaignType }[] = [
  { label: 'Tất Cả Sự Kiện', value: 'ALL' },
  { label: 'Dâng Y Kathina', value: 'KATHINA' },
  { label: 'Cúng Dường Trai Tăng', value: 'TRAI_TANG' },
  { label: 'Trùng Tu / Sửa Chùa', value: 'CONSTRUCTION' },
  { label: 'Từ Thiện & Cứu Trợ', value: 'CHARITY' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CampaignType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ALL');

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return MOCK_CAMPAIGNS.filter((c) => {
      const matchCategory =
        selectedCategory === 'ALL' || c.type === selectedCategory;
      const matchSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.temple.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.temple.province.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProvince =
        selectedProvince === 'ALL' || c.temple.province.includes(selectedProvince);

      return matchCategory && matchSearch && matchProvince;
    });
  }, [selectedCategory, searchQuery, selectedProvince]);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-100/60 via-amber-50/40 to-stone-50 pt-10 pb-12 sm:pt-16 sm:pb-16 border-b border-amber-200/50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-semibold text-amber-900 shadow-xs mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Nền Tảng Gây Quỹ Chùa Minh Bạch 100%</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-amber-950 sm:text-4xl lg:text-5xl leading-tight">
              Cúng dường Trai Tăng & Dâng Y Kathina Trực Tiếp
            </h1>

            <p className="mt-4 text-sm sm:text-base text-amber-900/90 leading-relaxed">
              Tiền cúng dường <strong className="text-amber-950">đi thẳng vào tài khoản ngân hàng của Chùa</strong> qua VietQR động. Mỗi sự kiện đều có bảng dự trù chi phí công khai và bắt buộc báo cáo thu - chi sau lễ.
            </p>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 rounded-2xl border border-amber-200 bg-white/80 p-4 shadow-xs backdrop-blur-xs">
              <div className="border-r border-amber-100 pr-2">
                <div className="text-lg sm:text-2xl font-black text-amber-900">100%</div>
                <div className="text-[11px] sm:text-xs text-amber-700 font-medium">Tiền vào thẳng Chùa</div>
              </div>
              <div className="border-r border-amber-100 pr-2">
                <div className="text-lg sm:text-2xl font-black text-amber-900">5+ Chùa</div>
                <div className="text-[11px] sm:text-xs text-amber-700 font-medium">Đã xác minh chính chủ</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-black text-emerald-700">100%</div>
                <div className="text-[11px] sm:text-xs text-amber-700 font-medium">Báo cáo thu - chi sau lễ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Search, Filters & Campaign List */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Search & Province Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-700" />
            <input
              type="text"
              placeholder="Tìm theo tên chùa, sự kiện hoặc tỉnh thành..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-amber-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-hidden focus:ring-1 focus:ring-amber-600 shadow-xs"
            />
          </div>

          {/* Province selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-amber-700 shrink-0" />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="rounded-2xl border border-amber-200 bg-white py-2.5 px-3 text-xs sm:text-sm font-medium text-amber-950 focus:border-amber-600 focus:outline-hidden shadow-xs"
            >
              <option value="ALL">Tất cả tỉnh thành</option>
              <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
              <option value="Đồng Nai">Đồng Nai</option>
              <option value="Bạc Liêu">Bạc Liêu</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'border border-amber-200 bg-white text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Campaign Grid */}
        {filteredCampaigns.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((camp) => (
              <CampaignCard key={camp.id} campaign={camp} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/50 p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-amber-400" />
            <h3 className="mt-3 font-bold text-amber-950 text-base">
              Không tìm thấy sự kiện phù hợp
            </h3>
            <p className="mt-1 text-xs text-amber-800/80">
              Hãy thử tìm kiếm với từ khóa khác hoặc bỏ chọn bộ lọc hiện tại.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
