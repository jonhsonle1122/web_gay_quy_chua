'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  PlusCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Building2,
  CreditCard,
  History,
  TrendingUp,
} from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mock-campaigns';

export default function TempleDashboardPage() {
  const [activeTab, setActiveTab] = useState<'CAMPAIGNS' | 'UNMATCHED'>('CAMPAIGNS');

  // Simulated unmatched transactions from bank webhook (without code)
  const [unmatchedTransactions, setUnmatchedTransactions] = useState([
    {
      id: 'tx-unmatched-1',
      code: 'MB_FT263228910',
      amount: 500000,
      content: 'NGUYEN VAN HAI CUNG DUONG CHUA AN LAC',
      time: '2026-11-18 10:15:20',
      status: 'UNMATCHED',
    },
    {
      id: 'tx-unmatched-2',
      code: 'MB_FT263217743',
      amount: 1000000,
      content: 'GIA DINH LE THI MAI UNG HO LE KATHINA',
      time: '2026-11-17 19:40:12',
      status: 'UNMATCHED',
    },
  ]);

  const templeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.temple.id === 'temple-1');

  const handleManualMatch = (txId: string) => {
    alert(`Đã gắn thủ công giao dịch ${txId} vào danh sách cúng dường. Hành động này đã được ghi vào Nhật ký kiểm toán (Audit Logs).`);
    setUnmatchedTransactions((prev) => prev.filter((t) => t.id !== txId));
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        {/* Header Profile Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-md">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                  Bàn Làm Việc: Chùa An Lạc
                </h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="mt-1 text-xs text-amber-800">
                124/8 Đường số 6, Phường Linh Tây, TP. Thủ Đức • Trụ trì: Đại đức Thích Thiện Tâm
              </p>
              <div className="mt-1.5 flex items-center gap-3 text-[11px] text-amber-700">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>STK MB: 9999012345678 (CHUA AN LAC)</span>
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">
                  Tỷ lệ báo cáo: 100% đúng hạn
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/chua/su-kien/tao-moi"
            className="flex items-center gap-2 rounded-2xl bg-amber-700 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-colors shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Tạo Sự Kiện Gây Quỹ Mới</span>
          </Link>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-2">
              <span>Tổng tịnh tài đã đối soát</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-amber-950 font-mono">
              102.500.000 đ
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              Tiền đã vào thẳng STK ngân hàng MB
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-2">
              <span>Sự kiện đang gây quỹ</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-950">
              1 sự kiện
            </div>
            <p className="mt-1 text-[11px] text-amber-700">
              Đại lễ Dâng Y Kathina PL.2570
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-2">
              <span>Giao dịch chưa khớp mã</span>
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-800 font-mono">
              {unmatchedTransactions.length} giao dịch
            </div>
            <p className="mt-1 text-[11px] text-amber-700">
              Cần đối chiếu thủ công bằng sao kê
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-amber-200 gap-4">
          <button
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'CAMPAIGNS'
                ? 'border-amber-700 text-amber-950'
                : 'border-transparent text-amber-800/70 hover:text-amber-950'
            }`}
          >
            Sự Kiện Của Chùa ({templeCampaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('UNMATCHED')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'UNMATCHED'
                ? 'border-amber-700 text-amber-950'
                : 'border-transparent text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>Hàng Đợi Đối Soát Tay</span>
            {unmatchedTransactions.length > 0 && (
              <span className="rounded-full bg-amber-600 px-2 py-0.2 text-[10px] text-white font-mono">
                {unmatchedTransactions.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Campaigns */}
        {activeTab === 'CAMPAIGNS' && (
          <div className="space-y-4">
            {templeCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-white p-5 shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={camp.coverImage}
                    alt={camp.title}
                    className="h-16 w-24 rounded-2xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                        {camp.typeLabel}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700">
                        • Đang mở cúng dường (FUNDING)
                      </span>
                    </div>
                    <h3 className="font-bold text-amber-950 text-base mt-1">
                      {camp.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-amber-800">
                      <span>Đã nhận: <strong className="font-mono text-amber-950">{camp.confirmedAmount.toLocaleString('vi-VN')} đ</strong> / {camp.targetAmount.toLocaleString('vi-VN')} đ</span>
                      <span>•</span>
                      <span>Ngày lễ: {camp.eventDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                  <Link
                    href={`/su-kien/${camp.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 rounded-xl border border-amber-200 px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-50"
                  >
                    <span>Xem trang</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <Link
                    href={`/chua/su-kien/${camp.id}/bao-cao`}
                    className="flex items-center gap-1 rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-800"
                  >
                    <FileCheck2 className="h-3.5 w-3.5" />
                    <span>Nộp Báo Cáo Thu - Chi</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Unmatched Queue */}
        {activeTab === 'UNMATCHED' && (
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-amber-100 pb-3">
              <h3 className="font-bold text-amber-950 text-base">
                Danh Sách Giao Dịch Chưa Khớp Mã Tự Động
              </h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Các giao dịch này đã vào tài khoản ngân hàng của Chùa nhưng Phật tử không ghi mã cúng dường hoặc sai cú pháp. Ban hộ tự vui lòng đối chiếu sao kê và bấm <strong>"Khớp thủ công"</strong>.
              </p>
            </div>

            {unmatchedTransactions.length > 0 ? (
              <div className="divide-y divide-amber-100">
                {unmatchedTransactions.map((tx) => (
                  <div key={tx.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-amber-950 bg-amber-100 px-2 py-0.5 rounded">
                          {tx.code}
                        </span>
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          +{tx.amount.toLocaleString('vi-VN')} đ
                        </span>
                      </div>
                      <p className="text-xs font-medium text-amber-900 mt-1">
                        Nội dung CK: <span className="italic">"{tx.content}"</span>
                      </p>
                      <span className="text-[11px] text-amber-700/70 block mt-0.5">
                        Thời gian: {tx.time}
                      </span>
                    </div>

                    <button
                      onClick={() => handleManualMatch(tx.id)}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                    >
                      Khớp Thủ Công Vào Quỹ
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-xs text-emerald-800 font-semibold">
                ✓ Tuyệt vời! Hiện không có giao dịch nào bị tồn đọng chưa khớp.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
