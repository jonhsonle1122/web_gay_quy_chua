'use client';

import { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { Campaign } from '@/types/campaign';
import {
  generateDonationCode,
  formatTransferContent,
  generateVietQRUrl,
} from '@/lib/vietqr/generator';
import Link from 'next/link';

interface DonationModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [100000, 200000, 500000, 1000000, 2000000];

export function DonationModal({ campaign, isOpen, onClose }: DonationModalProps) {
  const [step, setStep] = useState<'FORM' | 'QR' | 'SUCCESS'>('FORM');
  const [amount, setAmount] = useState<number>(200000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isAmountHidden, setIsAmountHidden] = useState<boolean>(false);
  const [prayerMessage, setPrayerMessage] = useState<string>('');

  // Generated QR state
  const [donationCode, setDonationCode] = useState<string>('');
  const [transferContent, setTransferContent] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (val: string) => {
    const rawNumber = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setAmount(rawNumber);
    setCustomAmount(rawNumber > 0 ? rawNumber.toLocaleString('vi-VN') : '');
  };

  const handleGenerateQR = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 10000) {
      alert('Số tiền cúng dường tối thiểu là 10.000 đ');
      return;
    }

    const code = generateDonationCode();
    const eventPrefix = campaign.type === 'KATHINA' ? 'KATHINA' : 'TRAITANG';
    const content = formatTransferContent(eventPrefix, code);

    const generatedQr = generateVietQRUrl({
      bankCode: campaign.temple.bankAccount.bankCode,
      accountNumber: campaign.temple.bankAccount.accountNumber,
      accountName: campaign.temple.bankAccount.accountName,
      amount,
      transferContent: content,
    });

    setDonationCode(code);
    setTransferContent(content);
    setQrUrl(generatedQr);
    setStep('QR');
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white">
              <Heart className="h-4 w-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 text-sm sm:text-base">
                Cúng Dường Trực Tiếp
              </h3>
              <p className="text-[11px] text-amber-800">
                Tiền chuyển thẳng tới {campaign.temple.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-amber-800/60 hover:bg-amber-100 hover:text-amber-950 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body based on step */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {step === 'FORM' && (
            <form onSubmit={handleGenerateQR} className="space-y-5">
              {/* Preset Amounts */}
              <div>
                <label className="mb-2 block font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Chọn số tiền cúng dường (VNĐ)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_AMOUNTS.map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => handleSelectPreset(val)}
                      className={`rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                        amount === val && !customAmount
                          ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                          : 'border-amber-200 bg-amber-50/50 text-amber-900 hover:bg-amber-100/60'
                      }`}
                    >
                      {val.toLocaleString('vi-VN')} đ
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Hoặc nhập số tiền khác (VNĐ)..."
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full rounded-xl border border-amber-200 px-3.5 py-2.5 text-sm font-medium text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-hidden focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>

              {/* Donor Name & Anonymous */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                    Họ tên / Pháp danh
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span>Cúng ẩn danh</span>
                  </label>
                </div>
                <input
                  type="text"
                  disabled={isAnonymous}
                  placeholder={isAnonymous ? 'Sẽ hiển thị là "Phật tử Ẩn Danh"' : 'Ví dụ: Phật tử Diệu Tâm...'}
                  value={isAnonymous ? '' : donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-3.5 py-2.5 text-sm text-amber-950 placeholder-amber-400 disabled:bg-amber-50/50 focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              {/* Hide Amount Checkbox */}
              <label className="flex items-center gap-2 text-xs text-amber-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAmountHidden}
                  onChange={(e) => setIsAmountHidden(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Ẩn số tiền trên danh sách công đức công khai</span>
              </label>

              {/* Prayer Message */}
              <div>
                <label className="mb-1.5 block font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Lời nhắn cầu an / Hồi hướng công đức
                </label>
                <textarea
                  rows={2}
                  placeholder="Cầu nguyện cho gia đạo an lành, quốc thái dân an..."
                  value={prayerMessage}
                  onChange={(e) => setPrayerMessage(e.target.value)}
                  className="w-full rounded-xl border border-amber-200 px-3.5 py-2 text-sm text-amber-950 placeholder-amber-400 focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 py-3.5 font-bold text-white shadow-md hover:from-amber-700 hover:to-amber-800 transition-all text-sm"
              >
                <QrCode className="h-4 w-4" />
                <span>Tạo Mã VietQR Cúng Dường ({amount.toLocaleString('vi-VN')} đ)</span>
              </button>
            </form>
          )}

          {step === 'QR' && (
            <div className="space-y-4 text-center">
              {/* Alert Notice */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-left flex items-start gap-2.5 text-xs text-amber-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Mã cúng dường: </span>
                  <span className="font-mono font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded">
                    {donationCode}
                  </span>
                  <p className="mt-0.5 text-amber-800/90 text-[11px]">
                    Quét mã QR bằng App Ngân Hàng. Tiền vào thẳng STK chùa, hệ thống tự động nhận diện theo mã.
                  </p>
                </div>
              </div>

              {/* QR Image Display */}
              <div className="mx-auto flex w-60 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/30 p-3 shadow-inner">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="VietQR Napas"
                    className="aspect-square w-full rounded-xl object-contain shadow-xs"
                  />
                ) : (
                  <div className="aspect-square w-full flex items-center justify-center text-amber-500">
                    Đang tạo mã QR...
                  </div>
                )}
                <span className="mt-2 text-[10px] text-amber-700 font-medium">
                  Chuẩn VietQR • Napas247 Tự Động
                </span>
              </div>

              {/* Manual Transfer Information with Copy Buttons */}
              <div className="rounded-2xl border border-amber-200/80 bg-white p-3.5 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Ngân hàng:</span>
                  <span className="font-bold text-amber-950">{campaign.temple.bankAccount.bankCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-950">
                      {campaign.temple.bankAccount.accountNumber}
                    </span>
                    <button
                      onClick={() => copyToClipboard(campaign.temple.bankAccount.accountNumber, 'acc')}
                      className="text-amber-600 hover:text-amber-800 p-0.5"
                    >
                      {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Tên chủ tài khoản:</span>
                  <span className="font-semibold text-amber-950">{campaign.temple.bankAccount.accountName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-800">Số tiền:</span>
                  <span className="font-mono font-bold text-amber-800">
                    {amount.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-amber-100">
                  <span className="text-amber-900 font-bold">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded">
                      {transferContent}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transferContent, 'content')}
                      className="text-amber-600 hover:text-amber-800 p-0.5"
                    >
                      {copiedField === 'content' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Listening & Simulated button for test */}
              <div className="pt-2 flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-xs text-amber-700 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Đang chờ thông báo giao dịch từ ngân hàng...</span>
                </div>

                {/* Simulated completion button for instant testing */}
                <button
                  type="button"
                  onClick={() => setStep('SUCCESS')}
                  className="w-full rounded-xl border border-emerald-400 bg-emerald-50 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  ✓ Tôi đã hoàn tất chuyển khoản (Mô phỏng khớp tức thì)
                </button>
              </div>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <Sparkles className="h-7 w-7" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-lg">
                  Cúng Dường Thành Công!
                </h4>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Hệ thống đã ghi nhận tịnh tài <strong className="text-amber-950">{amount.toLocaleString('vi-VN')} đ</strong> vào tài khoản {campaign.temple.name}.
                </p>
              </div>

              {/* Card Code Info */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-emerald-900">Mã cúng dường:</span>
                  <span className="font-mono font-bold text-emerald-950">{donationCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-900">Người cúng dường:</span>
                  <span className="font-semibold text-emerald-950">{isAnonymous ? 'Phật tử Ẩn Danh' : (donorName || 'Phật tử')}</span>
                </div>
                {prayerMessage && (
                  <div className="pt-2 border-t border-emerald-200/60">
                    <span className="text-emerald-900 block text-[11px] mb-0.5">Lời cầu nguyện:</span>
                    <p className="italic text-emerald-950 text-xs">"{prayerMessage}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href={`/tra-cuu?code=${donationCode}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-700 py-2.5 text-xs font-semibold text-white hover:bg-amber-800 transition-colors"
                >
                  <span>Xem Thiệp Hồi Hướng Điện Tử</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-amber-200 py-2 text-xs font-medium text-amber-800 hover:bg-amber-50"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
