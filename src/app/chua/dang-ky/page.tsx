'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CreditCard,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export default function TempleRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [templeName, setTempleName] = useState('Chùa An Lạc');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [address, setAddress] = useState('124/8 Đường số 6, Phường Linh Tây, TP. Thủ Đức');
  const [representativeName, setRepresentativeName] = useState('Đại đức Thích Thiện Tâm');
  const [phone, setPhone] = useState('0903123456');

  // Bank states
  const [bankCode, setBankCode] = useState('MB');
  const [accountNumber, setAccountNumber] = useState('9999012345678');
  const [accountName, setAccountName] = useState('CHUA AN LAC');

  // Document states
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: boolean }>({
    certificate: true,
    facade: true,
    representativeId: true,
  });

  const [isNameMatching, setIsNameMatching] = useState(true);

  const handleNextToDocuments = (e: React.FormEvent) => {
    e.preventDefault();
    // Rule: Tên chủ tài khoản phải trùng với tên chùa hoặc người đại diện
    const cleanAccount = accountName.trim().toUpperCase();
    const cleanTemple = templeName.trim().toUpperCase();
    const cleanRep = representativeName.trim().toUpperCase();

    if (!cleanAccount.includes(cleanTemple) && !cleanAccount.includes(cleanRep)) {
      setIsNameMatching(false);
      return;
    }
    setIsNameMatching(true);
    setStep(3);
  };

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); // Success / Waiting for Admin review
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Navigation */}
        <Link
          href="/chua/dang-nhap"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại trang đăng nhập</span>
        </Link>

        {/* Stepper Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950">
            Nộp Hồ Sơ Xác Minh Chùa
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-amber-800/90 leading-relaxed">
            Để bảo vệ niềm tin của Phật tử và chặn lừa đảo mạo danh, mỗi chùa cần qua quy trình duyệt 3 lớp trước khi được mở nút cúng dường.
          </p>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-900' : 'text-amber-400'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${step >= 1 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-600'}`}>
                1
              </span>
              <span>Thông tin chùa</span>
            </div>
            <div className="h-0.5 flex-1 bg-amber-200 mx-3" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-900' : 'text-amber-400'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${step >= 2 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-600'}`}>
                2
              </span>
              <span>Tài khoản ngân hàng</span>
            </div>
            <div className="h-0.5 flex-1 bg-amber-200 mx-3" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-900' : 'text-amber-400'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${step >= 3 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-600'}`}>
                3
              </span>
              <span>Giấy tờ pháp lý</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-amber-200 bg-white p-6 sm:p-8 shadow-xl">
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100 font-bold text-amber-950 text-base">
                <Building2 className="h-5 w-5 text-amber-700" />
                <span>Bước 1: Thông Tin Cơ Sở Chùa & Trụ Trì</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Tên Chùa / Tự Viện *
                </label>
                <input
                  type="text"
                  required
                  value={templeName}
                  onChange={(e) => setTempleName(e.target.value)}
                  placeholder="Ví dụ: Chùa An Lạc"
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Tỉnh / Thành phố *
                  </label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Địa chỉ chi tiết cơ sở *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Trụ trì / Người đứng đầu ban hộ tự *
                </label>
                <input
                  type="text"
                  required
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  placeholder="Ví dụ: Đại đức Thích Thiện Tâm"
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-2xl bg-amber-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-colors"
                >
                  <span>Tiếp tục: Khai báo STK Ngân Hàng</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextToDocuments} className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100 font-bold text-amber-950 text-base">
                <CreditCard className="h-5 w-5 text-amber-700" />
                <span>Bước 2: Khai Báo Tài Khoản Nhận Cúng Dường</span>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-xs text-amber-900 leading-relaxed">
                <strong>Nguyên tắc cứng:</strong> Toàn bộ tiền cúng dường từ Phật tử sẽ được quét thẳng vào STK này. Tên chủ tài khoản <strong>bắt buộc phải trùng khớp</strong> với tên Chùa hoặc Ban Hộ Tự / Trụ trì đã khai báo.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Ngân hàng tiếp nhận *
                  </label>
                  <select
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value="MB">MB Bank (Quân Đội)</option>
                    <option value="VCB">Vietcombank</option>
                    <option value="TCB">Techcombank</option>
                    <option value="BIDV">BIDV</option>
                    <option value="ACB">ACB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Số tài khoản ngân hàng *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="9999012345678"
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 font-mono text-sm font-bold text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Tên chủ tài khoản (Chữ in hoa không dấu) *
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  placeholder="CHUA AN LAC"
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 font-mono text-sm font-bold text-amber-950 uppercase focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              {!isNameMatching && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-bold">Cảnh báo không khớp tên:</span> Tên chủ tài khoản ({accountName}) không chứa tên chùa ({templeName.toUpperCase()}) hay tên trụ trì. Vui lòng kiểm tra lại hoặc tải thêm Giấy ủy quyền quản lý tài khoản ở bước tiếp theo.
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-2xl border border-amber-200 px-5 py-3 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-2xl bg-amber-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-colors"
                >
                  <span>Tiếp tục: Tải Giấy Tờ</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitProfile} className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-amber-100 font-bold text-amber-950 text-base">
                <FileText className="h-5 w-5 text-amber-700" />
                <span>Bước 3: Tải Lên Giấy Tờ Xác Minh</span>
              </div>

              {/* Upload Item 1 */}
              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-amber-950">
                    1. Giấy chứng nhận cơ sở tôn giáo / Quyết định bổ nhiệm
                  </div>
                  <div className="text-[11px] text-amber-800/80">
                    Đã chọn: <span className="font-mono text-emerald-700 font-semibold">quyet_dinh_bo_nhiem_tru_tri.pdf</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đã tải</span>
                </span>
              </div>

              {/* Upload Item 2 */}
              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-amber-950">
                    2. Ảnh chụp mặt tiền khuôn viên Chùa có bảng tên
                  </div>
                  <div className="text-[11px] text-amber-800/80">
                    Đã chọn: <span className="font-mono text-emerald-700 font-semibold">mat_tien_chua_an_lac.jpg</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đã tải</span>
                </span>
              </div>

              {/* Upload Item 3 */}
              <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-amber-950">
                    3. CCCD / Định danh của Trụ trì / Người đại diện
                  </div>
                  <div className="text-[11px] text-amber-800/80">
                    Đã chọn: <span className="font-mono text-emerald-700 font-semibold">cccd_nguoi_dai_dien.jpg</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Đã tải</span>
                </span>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-2xl border border-amber-200 px-5 py-3 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Hoàn Tất & Gửi Hồ Sơ Xác Minh</span>
                </button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-xl font-bold text-amber-950">
                Hồ Sơ Đã Được Gửi Thành Công!
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
                Hồ sơ của <strong>{templeName}</strong> đã vào hàng đợi duyệt của Admin. Trong vòng <strong>48 giờ làm việc</strong>, đội ngũ thẩm định sẽ gọi video call xác minh chéo trước khi cấp tick xanh Verified.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => router.push('/chua/dashboard')}
                  className="rounded-2xl bg-amber-700 px-6 py-3 text-xs font-bold text-white hover:bg-amber-800 transition-colors"
                >
                  Vào Bàn Làm Việc (Dashboard)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
