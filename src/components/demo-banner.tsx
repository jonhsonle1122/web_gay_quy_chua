'use client';

import { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldAlert, Lock } from 'lucide-react';

function DemoBannerInner() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/access') return null;

  const handleLock = () => {
    document.cookie = 'app_pin_verified=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/access');
  };

  return (
    <div className="bg-stone-900 border-b border-amber-500/30 px-3 py-1.5 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 text-amber-300 truncate">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-amber-400" />
          <span className="font-bold uppercase tracking-wider">Môi Trường Test Nội Bộ:</span>
          <span className="text-stone-300 hidden sm:inline">
            Toàn bộ số liệu và tên cơ sở tôn giáo là dữ liệu mô phỏng. Tuyệt đối không chuyển tiền thật.
          </span>
        </div>

        <button
          onClick={handleLock}
          className="flex items-center gap-1 rounded-full bg-stone-800 px-2.5 py-0.5 text-[10px] font-semibold text-stone-300 hover:bg-stone-700 hover:text-white transition-colors shrink-0 border border-stone-700 cursor-pointer"
          title="Khóa lại màn hình PIN"
        >
          <Lock className="h-3 w-3 text-amber-400" />
          <span>Khóa Web</span>
        </button>
      </div>
    </div>
  );
}

export function DemoBanner() {
  return (
    <Suspense fallback={null}>
      <DemoBannerInner />
    </Suspense>
  );
}
