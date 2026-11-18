'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Trash2,
  Calendar,
  Calculator,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { CampaignType, SurplusPolicy } from '@/types/campaign';

interface BudgetItemInput {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function CreateCampaignPage() {
  const router = useRouter();

  // Basic info
  const [type, setType] = useState<CampaignType>('KATHINA');
  const [title, setTitle] = useState('Đại Lễ Dâng Y Kathina PL.2570');
  const [eventDate, setEventDate] = useState('2026-11-25');
  const [endDate, setEndDate] = useState('2026-11-23');
  const [description, setDescription] = useState(
    'Thiết lập trai đàn cúng dường y áo và tứ vật dụng lên Chư Tăng sau ba tháng an cư kiết hạ.'
  );

  // Specifics
  const [monksCount, setMonksCount] = useState<number>(100);
  const [robesCount, setRobesCount] = useState<number>(50);

  // Surplus Policy
  const [surplusPolicy, setSurplusPolicy] = useState<SurplusPolicy>('CHARITY_FUND');

  // Dynamic Budget Table
  const [budgetItems, setBudgetItems] = useState<BudgetItemInput[]>([
    { id: '1', name: 'Y Kathina và tứ vật dụng', quantity: 1, unitPrice: 30000000 },
    { id: '2', name: 'Phẩm vật cúng dường Trai Tăng 100 vị', quantity: 100, unitPrice: 500000 },
    { id: '3', name: 'Thực phẩm chay và hậu cần', quantity: 1, unitPrice: 45000000 },
    { id: '4', name: 'Âm thanh rạp che và trang trí', quantity: 1, unitPrice: 15000000 },
    { id: '5', name: 'Quỹ dự phòng phát sinh', quantity: 1, unitPrice: 10000000 },
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto calculate total target
  const targetAmount = budgetItems.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );

  const handleAddItem = () => {
    setBudgetItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: '',
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (budgetItems.length <= 1) return;
    setBudgetItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (
    id: string,
    field: keyof BudgetItemInput,
    value: string | number
  ) => {
    setBudgetItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetAmount <= 0) {
      alert('Vui lòng nhập các hạng mục dự trù chi phí hợp lệ.');
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation */}
        <Link
          href="/chua/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Về bàn làm việc</span>
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-950">
            Tạo Sự Kiện Gây Quỹ Mới
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-amber-800/90 leading-relaxed">
            Mỗi sự kiện bắt buộc phải lập bảng dự trù chi tiết từng hạng mục. Tổng tiền dự trù sẽ tự động trở thành <strong>Mục tiêu gây quỹ công khai</strong>.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: General Info */}
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="font-bold text-amber-950 text-base border-b border-amber-100 pb-3">
                1. Thông Tin Chung Sự Kiện
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Loại sự kiện *
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CampaignType)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm font-semibold text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  >
                    <option value="KATHINA">Dâng Y Kathina</option>
                    <option value="TRAI_TANG">Cúng Dường Trai Tăng</option>
                    <option value="CONSTRUCTION">Xây Dựng / Sửa Chùa</option>
                    <option value="AN_VI">An Vị Phật</option>
                    <option value="CHARITY">Từ Thiện / Cứu Trợ</option>
                    <option value="OTHER">Phật Sự Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Tên sự kiện đại lễ *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {type === 'KATHINA' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-amber-50/60 p-4 border border-amber-200/80">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Số lượng Y Ka-thi-na dự kiến
                    </label>
                    <input
                      type="number"
                      value={robesCount}
                      onChange={(e) => setRobesCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-mono text-amber-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      Số lượng Chư Tăng Ni dự kiến
                    </label>
                    <input
                      type="number"
                      value={monksCount}
                      onChange={(e) => setMonksCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-mono text-amber-950"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Ngày diễn ra lễ chính thức *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                    Ngày đóng quỹ nhận cúng dường *
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Mô tả ý nghĩa và chương trình buổi lễ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2 text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 2: Dynamic Budget Table */}
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2 font-bold text-amber-950 text-base">
                  <Calculator className="h-5 w-5 text-amber-700" />
                  <span>2. Bảng Dự Trù Chi Phí (Tự Động Tính Mục Tiêu)</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Thêm Hạng Mục</span>
                </button>
              </div>

              <div className="space-y-3">
                {budgetItems.map((item, index) => {
                  const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2.5 items-center rounded-2xl border border-amber-100 bg-amber-50/30 p-3"
                    >
                      <div className="col-span-12 sm:col-span-5">
                        <label className="block text-[10px] font-bold uppercase text-amber-800 mb-0.5">
                          Tên hạng mục #{index + 1}
                        </label>
                        <input
                          type="text"
                          required
                          value={item.name}
                          onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                          placeholder="Ví dụ: Phẩm vật cúng dường..."
                          className="w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs text-amber-950"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-amber-800 mb-0.5">
                          Số lượng
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs text-center font-mono text-amber-950"
                        />
                      </div>

                      <div className="col-span-8 sm:col-span-3">
                        <label className="block text-[10px] font-bold uppercase text-amber-800 mb-0.5">
                          Đơn giá (VNĐ)
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={10000}
                          required
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs text-right font-mono text-amber-950"
                        />
                      </div>

                      <div className="col-span-10 sm:col-span-2 text-right">
                        <span className="block text-[10px] font-bold uppercase text-amber-800 mb-0.5">
                          Thành tiền
                        </span>
                        <span className="font-mono font-bold text-xs text-amber-950">
                          {lineTotal.toLocaleString('vi-VN')} đ
                        </span>
                      </div>

                      <div className="col-span-2 sm:col-span-12 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-amber-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation Display */}
              <div className="flex items-center justify-between rounded-2xl bg-amber-100/70 p-4 border border-amber-200">
                <span className="font-bold text-amber-950 text-sm">
                  Tổng Mục Tiêu Gây Quỹ Tự Động:
                </span>
                <span className="font-mono font-extrabold text-lg text-amber-900">
                  {targetAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            {/* Step 3: Surplus Commitment */}
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="font-bold text-amber-950 text-base border-b border-amber-100 pb-3">
                3. Cam Kết Xử Lý Tiền Dư Sau Lễ
              </h2>

              <p className="text-xs text-amber-800 leading-relaxed">
                Chùa phải công khai trước hướng xử lý nếu số tiền cúng dường thực tế vượt quá nhu cầu chi tiêu:
              </p>

              <div className="space-y-2">
                <label className="flex items-center gap-2.5 rounded-2xl border border-amber-200 p-3 text-xs text-amber-950 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="radio"
                    name="surplusPolicy"
                    checked={surplusPolicy === 'CHARITY_FUND'}
                    onChange={() => setSurplusPolicy('CHARITY_FUND')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <strong className="block">Đưa vào Quỹ Từ Thiện của Chùa</strong>
                    <span className="text-amber-800/80 text-[11px]">Dùng cứu trợ bà con nghèo, phát gạo, học bổng tại địa phương.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 rounded-2xl border border-amber-200 p-3 text-xs text-amber-950 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="radio"
                    name="surplusPolicy"
                    checked={surplusPolicy === 'NEXT_EVENT'}
                    onChange={() => setSurplusPolicy('NEXT_EVENT')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <strong className="block">Chuyển sang Sự Kiện Tiếp Theo của Chùa</strong>
                    <span className="text-amber-800/80 text-[11px]">Bảo lưu số tiền sang đại lễ hoặc công trình xây dựng kế tiếp.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 rounded-2xl border border-amber-200 p-3 text-xs text-amber-950 cursor-pointer hover:bg-amber-50/50">
                  <input
                    type="radio"
                    name="surplusPolicy"
                    checked={surplusPolicy === 'NEXT_SEASON'}
                    onChange={() => setSurplusPolicy('NEXT_SEASON')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <strong className="block">Giữ cho cùng mục đích vào Mùa Lễ Năm Sau</strong>
                    <span className="text-amber-800/80 text-[11px]">Bảo tồn nguyên vẹn nguồn quỹ cho mùa lễ Kathina / Trai Tăng năm kế tiếp.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/chua/dashboard"
                className="rounded-2xl border border-amber-200 px-6 py-3 text-xs font-semibold text-amber-900 hover:bg-amber-50"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-amber-700 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:bg-amber-800 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Gửi Admin Phê Duyệt</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-amber-950">
              Sự Kiện Đã Được Gửi Duyệt!
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
              Sự kiện <strong>"{title}"</strong> với mục tiêu <strong>{targetAmount.toLocaleString('vi-VN')} đ</strong> đang ở trạng thái <code>PENDING_REVIEW</code>. Admin sẽ rà soát nội dung và bảng dự trù trước khi mở link và mã VietQR công khai.
            </p>

            <div className="pt-4">
              <button
                onClick={() => router.push('/chua/dashboard')}
                className="rounded-2xl bg-amber-700 px-6 py-3 text-xs font-bold text-white hover:bg-amber-800"
              >
                Về Bàn Làm Việc
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
