'use client';

import Link from 'next/link';
import { Search, ShieldCheck, HeartHandshake, Home } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-200/60 bg-amber-50/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-sm">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-amber-950 text-base sm:text-lg tracking-tight">
              <span>Cúng Dường</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-900">
                Minh Bạch
              </span>
            </div>
            <p className="hidden text-[11px] text-amber-800/80 sm:block">
              Tiền về thẳng tài khoản chùa • Bắt buộc báo cáo
            </p>
          </div>
        </Link>

        {/* Action Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/tra-cuu"
            className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 shadow-xs hover:bg-amber-100/60 transition-colors"
          >
            <Search className="h-3.5 w-3.5 text-amber-700" />
            <span>Tra cứu giao dịch</span>
          </Link>

          <Link
            href="/chua/dang-nhap"
            className="flex items-center gap-1.5 rounded-full bg-amber-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-amber-800 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dành cho</span> Chùa
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1 rounded-full border border-stone-300 bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 transition-colors"
          >
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
