'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldAlert, KeyRound, ArrowRight, Sparkles } from 'lucide-react';

function AccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const CORRECT_PIN = process.env.NEXT_PUBLIC_DEMO_PIN || '123456';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === CORRECT_PIN) {
      // Lưu cookie xác thực trong 7 ngày
      document.cookie = 'app_pin_verified=true; path=/; max-age=604800; SameSite=Lax';
      router.push(redirectUrl);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-950 p-6 sm:p-8 text-white shadow-2xl space-y-6">
        {/* Lock Icon */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <Lock className="h-8 w-8" />
          </div>
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            Private Staging Sandbox
          </span>
          <h1 className="mt-2 text-2xl font-black text-amber-100">
            Khu Vực Thử Nghiệm Nội Bộ
          </h1>
          <p className="mt-1 text-xs text-stone-400 leading-relaxed">
            Hệ thống đang được khóa bảo vệ. Vui lòng nhập mã PIN bảo mật để tiếp tục.
          </p>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/40 p-4 text-xs text-rose-200/90 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed text-[11px]">
            <strong>CẢNH BÁO BẢO VỆ PHÁP LÝ:</strong> Đây là môi trường nghiên cứu công nghệ và kiểm thử kỹ thuật kín. Toàn bộ hình ảnh, tên cơ sở tự viện và số liệu cúng dường đều là <strong>dữ liệu giả lập (Mock Data)</strong>. Nền tảng tuyệt đối không thực hiện bất kỳ hoạt động tiếp nhận hay kêu gọi tiền tệ thật nào ra công chúng.
          </div>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-300/80 mb-2 text-center">
              Nhập mã PIN truy cập (6 chữ số)
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="••••••"
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value.replace(/\D/g, ''));
                }}
                className={`w-full rounded-2xl border py-3 px-4 text-center font-mono text-2xl tracking-[0.5em] font-extrabold text-amber-300 bg-stone-900/80 focus:outline-hidden transition-all ${
                  error
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-400'
                    : 'border-amber-500/40 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                }`}
              />
            </div>

            {error && (
              <p className="mt-2 text-center text-xs font-semibold text-rose-400">
                Mã PIN không đúng, vui lòng thử lại!
              </p>
            )}

            <p className="mt-2 text-center text-[11px] text-stone-400">
              Mã PIN mặc định dành cho bạn: <strong className="font-mono text-amber-300">123456</strong>
            </p>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-600 py-3.5 text-xs font-bold text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all cursor-pointer"
          >
            <span>Mở Khóa Để Kiểm Thử</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-900 flex items-center justify-center text-xs text-amber-400">
          Đang tải bảo vệ...
        </div>
      }
    >
      <AccessContent />
    </Suspense>
  );
}
