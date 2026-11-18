'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Phone, Mail, ArrowRight, Lock, HeartHandshake } from 'lucide-react';

export default function TempleLoginPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState<'PHONE' | 'EMAIL'>('PHONE');
  const [identifier, setIdentifier] = useState('0903123456');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setOtpSent(true);
    setOtpCode('123456'); // Simulated OTP
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login success -> redirect to Temple Dashboard
    router.push('/chua/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-amber-200 bg-white p-6 sm:p-8 shadow-xl">
        {/* Brand & Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-xs mb-3">
            <HeartHandshake className="h-7 w-7 text-amber-700" />
          </div>
          <h1 className="text-2xl font-bold text-amber-950">
            Dành Cho Ban Hộ Tự Chùa
          </h1>
          <p className="mt-1 text-xs text-amber-800/90 leading-relaxed">
            Đăng nhập để quản lý sự kiện gây quỹ, đối soát tịnh tài và nộp báo cáo thu - chi sau lễ.
          </p>
        </div>

        {/* Tab method */}
        <div className="mb-6 flex rounded-2xl border border-amber-200 bg-amber-50/50 p-1">
          <button
            type="button"
            onClick={() => { setAuthMethod('PHONE'); setOtpSent(false); }}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              authMethod === 'PHONE'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-amber-900 hover:text-amber-950'
            }`}
          >
            Số Điện Thoại
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('EMAIL'); setOtpSent(false); }}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              authMethod === 'EMAIL'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-amber-900 hover:text-amber-950'
            }`}
          >
            Email
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                {authMethod === 'PHONE' ? 'Số điện thoại người đại diện' : 'Địa chỉ Email'}
              </label>
              <div className="relative">
                {authMethod === 'PHONE' ? (
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700" />
                ) : (
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700" />
                )}
                <input
                  type={authMethod === 'PHONE' ? 'tel' : 'email'}
                  required
                  placeholder={authMethod === 'PHONE' ? '0903 123 456' : 'chua.anlac@gmail.com'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-2xl border border-amber-200 py-3 pl-10 pr-4 text-sm font-medium text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-700 py-3.5 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-colors"
            >
              <span>Gửi Mã Xác Thực OTP</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                Nhập mã OTP gồm 6 chữ số
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full rounded-2xl border border-amber-200 py-3 pl-10 pr-4 text-center text-lg font-mono tracking-widest font-bold text-amber-950 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
              <p className="mt-1.5 text-[11px] text-amber-700 text-center">
                Mã xác thực thử nghiệm: <strong className="font-mono">123456</strong>
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Xác Thực & Vào Bàn Làm Việc</span>
            </button>
          </form>
        )}

        {/* Register link */}
        <div className="mt-6 border-t border-amber-100 pt-4 text-center">
          <p className="text-xs text-amber-800">
            Chùa chưa có tài khoản trên nền tảng?{' '}
            <Link
              href="/chua/dang-ky"
              className="font-bold text-amber-900 underline hover:text-amber-950"
            >
              Đăng ký & Nộp hồ sơ xác minh
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
