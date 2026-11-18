'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Share2,
  ArrowLeft,
  Building,
  Heart,
  FileCheck,
} from 'lucide-react';

function LookupContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = (searchCode: string) => {
    const formatted = searchCode.trim().toUpperCase();
    setSearched(true);

    if (formatted === 'CD-8F3K2' || formatted === 'CD8F3K2') {
      setResult({
        donationCode: 'CD-8F3K2',
        donorName: 'Phật tử Diệu Tâm',
        amount: 2000000,
        prayerMessage:
          'Nguyện đem công đức này hồi hướng cho cha mẹ hiện tiền an khang, quá vãng siêu sinh tịnh độ.',
        templeName: 'Chùa An Lạc',
        campaignTitle: 'Đại Lễ Dâng Y Kathina PL.2570 - DL.2026',
        bankCode: 'MB Bank',
        bankAccount: '9999012345678',
        transactionTime: '2026-11-18 10:30:15',
        status: 'CONFIRMED',
        statusLabel: 'Đã Đối Soát Khớp Tài Khoản Chùa',
      });
    } else if (formatted.startsWith('CD-')) {
      // Mock result for newly generated code
      setResult({
        donationCode: formatted,
        donorName: 'Phật tử Thiện Duyên',
        amount: 500000,
        prayerMessage: 'Cầu cho gia đạo an lành, thân tâm thường lạc.',
        templeName: 'Chùa An Lạc',
        campaignTitle: 'Đại Lễ Dâng Y Kathina PL.2570',
        bankCode: 'MB Bank',
        bankAccount: '9999012345678',
        transactionTime: 'Vừa xong',
        status: 'CONFIRMED',
        statusLabel: 'Đã Đối Soát Tự Động Qua Webhook',
      });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
        {/* Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về trang chủ</span>
        </Link>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 shadow-xs mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-amber-950 sm:text-3xl">
            Tra Cứu Giao Dịch Cúng Dường
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-amber-800 leading-relaxed">
            Nhập mã cúng dường (dạng <code className="font-bold text-amber-950">CD-XXXXX</code>) để kiểm tra trạng thái tịnh tài đã về đến tài khoản chùa hay chưa và nhận thiệp hồi hướng công đức.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-3xl border border-amber-200 bg-white p-4 sm:p-6 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(code);
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <input
              type="text"
              placeholder="Nhập mã cúng dường (ví dụ: CD-8F3K2)..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 rounded-2xl border border-amber-200 px-4 py-3 text-sm font-semibold uppercase text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-hidden"
            />
            <button
              type="submit"
              className="rounded-2xl bg-amber-700 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-amber-800 transition-colors"
            >
              Tra Cứu Ngay
            </button>
          </form>

          <div className="mt-3 text-[11px] text-amber-700">
            * Thử nhanh với mã có sẵn trong hệ thống: <button type="button" onClick={() => { setCode('CD-8F3K2'); handleSearch('CD-8F3K2'); }} className="font-mono font-bold underline">CD-8F3K2</button>
          </div>
        </div>

        {/* Result Area */}
        {searched && (
          <div>
            {result ? (
              <div className="space-y-6">
                {/* Status Box */}
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-900 uppercase">
                        {result.statusLabel}
                      </span>
                      <h3 className="mt-1 font-bold text-emerald-950 text-base">
                        Giao dịch đã khớp chính xác
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Tịnh tài đã được ghi nhận vào tài khoản {result.templeName} lúc {result.transactionTime}.
                      </p>
                    </div>
                  </div>
                </div>

                {/* E-Certificate (Thiệp Hồi Hướng Điện Tử) */}
                <div className="relative overflow-hidden rounded-3xl border-4 border-amber-300 bg-gradient-to-b from-amber-50 via-white to-amber-50/80 p-6 sm:p-8 shadow-xl text-center">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-amber-700/60">
                    MÃ: {result.donationCode}
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <FileCheck className="h-3 w-3" />
                    <span>Chứng nhận chính thức</span>
                  </div>

                  {/* Lotus Icon Decoration */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-800 shadow-inner mb-3">
                    <Sparkles className="h-8 w-8 text-amber-600" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
                    Thiệp Công Đức & Hồi Hướng
                  </span>

                  <h2 className="mt-2 text-xl sm:text-2xl font-black text-amber-950 font-serif">
                    CÔNG ĐỨC VÔ LƯỢNG
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm text-amber-900 max-w-lg mx-auto leading-relaxed">
                    Chùa <strong className="text-amber-950">{result.templeName}</strong> xin thành kính tán thán và tri ân công đức của:
                  </p>

                  <div className="my-4 inline-block rounded-2xl bg-amber-100/80 px-6 py-2 border border-amber-300">
                    <span className="text-lg sm:text-xl font-extrabold text-amber-950 font-serif">
                      {result.donorName}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-amber-900">
                    Đã phát tâm cúng dường tịnh tài:{' '}
                    <strong className="text-amber-950 font-mono text-base">
                      {result.amount.toLocaleString('vi-VN')} đ
                    </strong>
                  </p>

                  <p className="text-xs text-amber-800 mt-1">
                    Nhân dịp: <span className="font-semibold text-amber-950">{result.campaignTitle}</span>
                  </p>

                  {result.prayerMessage && (
                    <div className="mt-4 rounded-2xl border border-amber-200/80 bg-white/70 p-4 text-xs italic text-amber-900 max-w-md mx-auto">
                      "{result.prayerMessage}"
                    </div>
                  )}

                  <div className="mt-6 border-t border-amber-200/60 pt-4 text-[11px] text-amber-700">
                    Nguyện cầu hồng ân Tam Bảo gia hộ cho quý Phật tử cùng toàn thể gia quyến thân tâm thường an lạc, sở cầu như ý, phước huệ trang nghiêm.
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50/50 p-8 text-center space-y-3">
                <Clock className="mx-auto h-10 w-10 text-amber-600" />
                <h3 className="font-bold text-amber-950 text-base">
                  Chưa tìm thấy thông tin cho mã "{code}"
                </h3>
                <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                  Nếu bạn vừa mới chuyển khoản, ngân hàng có thể mất 1–3 phút để gửi thông báo webhook. Vui lòng thử lại sau giây lát.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LookupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-amber-800">Đang tải trang tra cứu...</div>}>
      <LookupContent />
    </Suspense>
  );
}
