'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  ArrowLeft,
  DollarSign,
  Video,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mock-campaigns';

export default function SubmitReportPage() {
  const router = useRouter();
  const campaign = MOCK_CAMPAIGNS[0]; // Đại lễ Dâng Y Kathina

  // Report fields
  const actualTotalRaised = campaign.confirmedAmount; // 102.500.000 đ
  const [actualExpenses, setActualExpenses] = useState<{ [id: string]: number }>({
    'b-1': 28500000,
    'b-2': 48000000,
    'b-3': 18000000,
    'b-4': 5000000,
    'b-5': 0,
  });

  const [livestreamUrl, setLivestreamUrl] = useState(
    'https://www.youtube.com/watch?v=mock-livestream-kathina-2026'
  );
  const [explanation, setExplanation] = useState(
    'Buổi lễ diễn ra trang nghiêm, thanh tịnh với sự quang lâm của 100 vị Tăng Ni và hơn 400 Phật tử. Chi phí thực phẩm tiết kiệm được 27 triệu do Phật tử tự nguyện cúng dường thêm rau củ quả tươi.'
  );

  const [uploadedReceipts, setUploadedReceipts] = useState<string[]>([
    'hoa_don_y_ao_kathina.pdf',
    'hoa_don_am_thanh_rap_che.jpg',
    'bien_lai_mua_thuc_pham_chay.pdf',
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Total spent
  const totalSpent = Object.values(actualExpenses).reduce((a, b) => a + (b || 0), 0);
  const surplus = actualTotalRaised - totalSpent;

  const handleExpenseChange = (id: string, value: number) => {
    setActualExpenses((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
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
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 uppercase">
            Nghĩa Vụ Bắt Buộc Sau Lễ (Trong 7 Ngày)
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-950">
            Nộp Báo Cáo Thu - Chi Sau Lễ
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-amber-800 leading-relaxed">
            Sự kiện: <strong>{campaign.title}</strong> • Ngày diễn ra lễ: {campaign.eventDate}
          </p>
        </div>

        {/* Mandatory Policy Warning */}
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Quy tắc tự làm sạch nền tảng:</strong> Chùa bắt buộc phải nộp báo cáo thu chi chi tiết và chứng từ hóa đơn. Nếu quá 7 ngày chưa nộp, hệ thống sẽ tạm khóa tính năng tạo sự kiện mới. Nếu quá 30 ngày, hồ sơ Chùa sẽ bị gắn cờ cảnh báo công khai.
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmitReport} className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-amber-800 uppercase block mb-1">
                  1. Tổng Thu Thực Nhận
                </span>
                <span className="font-mono text-2xl font-black text-emerald-700">
                  {actualTotalRaised.toLocaleString('vi-VN')} đ
                </span>
                <p className="text-[11px] text-amber-700 mt-1">
                  Khớp 100% từ đối soát ngân hàng
                </p>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-amber-800 uppercase block mb-1">
                  2. Tổng Chi Thực Tế
                </span>
                <span className="font-mono text-2xl font-black text-amber-950">
                  {totalSpent.toLocaleString('vi-VN')} đ
                </span>
                <p className="text-[11px] text-amber-700 mt-1">
                  Theo bảng kê chi tiết bên dưới
                </p>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-white p-5 shadow-xs">
                <span className="text-xs font-semibold text-amber-800 uppercase block mb-1">
                  3. Tịnh Tài Còn Dư
                </span>
                <span className="font-mono text-2xl font-black text-amber-800">
                  {surplus.toLocaleString('vi-VN')} đ
                </span>
                <p className="text-[11px] text-amber-700 mt-1">
                  Đưa vào Quỹ từ thiện cứu trợ
                </p>
              </div>
            </div>

            {/* Comparison Budget Table */}
            <div className="overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-xs">
              <div className="bg-amber-50/70 px-5 py-3.5 border-b border-amber-100 font-bold text-amber-950 text-sm">
                Bảng Đối Chiếu: Dự Trù Ban Đầu vs Chi Phí Thực Tế
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-amber-100 bg-amber-50/30 text-amber-900 font-semibold">
                    <tr>
                      <th className="px-5 py-3">Hạng mục chi</th>
                      <th className="px-3 py-3 text-right">Dự trù ban đầu</th>
                      <th className="px-5 py-3 text-right">Chi phí thực tế (VNĐ)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/70">
                    {campaign.budgetItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-5 py-3.5 font-medium text-amber-950">
                          {item.name}
                        </td>
                        <td className="px-3 py-3.5 text-right font-mono text-amber-800">
                          {item.totalPrice.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-5 py-3 text-right">
                          <input
                            type="number"
                            min={0}
                            step={50000}
                            required
                            value={actualExpenses[item.id] ?? item.totalPrice}
                            onChange={(e) =>
                              handleExpenseChange(item.id, Number(e.target.value))
                            }
                            className="w-40 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-right font-mono text-xs font-bold text-amber-950 focus:border-amber-600 focus:outline-hidden"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-amber-200 bg-amber-50/60 font-bold text-amber-950">
                    <tr>
                      <td className="px-5 py-3.5">Tổng cộng:</td>
                      <td className="px-3 py-3.5 text-right font-mono text-amber-800">
                        {campaign.targetAmount.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-emerald-800 text-base">
                        {totalSpent.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Proofs & Livestream link */}
            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="font-bold text-amber-950 text-base border-b border-amber-100 pb-3">
                Hình Ảnh Hóa Đơn Chứng Từ & Video Buổi Lễ
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Đường dẫn Video / Livestream buổi lễ *
                </label>
                <div className="relative">
                  <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700" />
                  <input
                    type="url"
                    required
                    value={livestreamUrl}
                    onChange={(e) => setLivestreamUrl(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 py-2.5 pl-10 pr-4 text-xs font-mono text-amber-950 focus:border-amber-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-2">
                  Danh sách file chứng từ / hóa đơn đã tải lên (3 tệp)
                </label>
                <div className="space-y-2">
                  {uploadedReceipts.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/40 px-3.5 py-2 text-xs"
                    >
                      <span className="font-mono text-amber-950 font-semibold">{file}</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Đã sẵn sàng
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Giải trình chênh lệch & Báo cáo tổng kết đại lễ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-xs text-amber-950 focus:border-amber-600 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-3">
              <Link
                href="/chua/dashboard"
                className="rounded-2xl border border-amber-200 px-6 py-3 text-xs font-semibold text-amber-900 hover:bg-amber-50"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
              >
                <FileCheck2 className="h-4 w-4" />
                <span>Hoàn Tất & Gửi Báo Cáo Cho Admin</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center space-y-4 shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-amber-950">
              Báo Cáo Thu - Chi Đã Được Nộp Thành Công!
            </h2>
            <p className="text-xs sm:text-sm text-amber-800 max-w-md mx-auto leading-relaxed">
              Báo cáo của Chùa An Lạc đã được ghi nhận. Sau khi Admin kiểm tra đối chiếu hóa đơn, toàn bộ con số và chứng từ sẽ được <strong>công khai vĩnh viễn</strong> trên trang sự kiện cho toàn thể thập phương Phật tử giám sát.
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
