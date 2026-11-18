'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert, ArrowRight, HeartHandshake } from 'lucide-react';

export default function AccessPage() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRedirectUrl(params.get('redirect') || '/');
    }
  }, []);

  const CORRECT_PIN = process.env.NEXT_PUBLIC_DEMO_PIN || '123456';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === CORRECT_PIN) {
      // Lưu cookie xác thực trong 7 ngày
      document.cookie = 'app_pin_verified=true; path=/; max-age=604800; SameSite=Lax';
      // Dùng window.location.href để reload và đi thẳng vào trang đích với cookie mới
      window.location.href = redirectUrl;
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950 p-4 overflow-y-auto">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/30 bg-stone-900 p-6 sm:p-8 text-white shadow-2xl space-y-6 my-auto">
        {/* Header Icon */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md mb-3">
            <Lock className="h-7 w-7 text-amber-200" />
          </div>
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            Private Demo Sandbox
          </span>
          <h1 className="mt-2 text-xl sm:text-2xl font-black text-amber-100">
            Hệ Thống Thử Nghiệm Nội Bộ
          </h1>
          <p className="mt-1 text-xs text-stone-400 leading-relaxed">
            Hệ thống đang được khóa bảo vệ. Vui lòng nhập mã PIN bảo mật để vào xem giao diện.
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
              Nhập mã PIN truy cập (6 số)
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
                className={`w-full rounded-2xl border py-3.5 px-4 text-center font-mono text-2xl tracking-[0.5em] font-extrabold text-amber-300 bg-stone-950 focus:outline-hidden transition-all ${
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

            <p className="mt-2.5 text-center text-xs text-stone-400">
              Mã PIN của bạn: <strong className="font-mono text-amber-300 text-sm">123456</strong>
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
