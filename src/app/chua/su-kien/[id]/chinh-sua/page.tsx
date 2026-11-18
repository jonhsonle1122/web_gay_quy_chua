'use client';

import { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Lock,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  BellRing,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { MOCK_CAMPAIGNS } from '@/data/mock-campaigns';
import { BudgetItem } from '@/types/campaign';

function EditCampaignContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Lấy sự kiện hiện tại (hoặc mặc định camp-1)
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id) || MOCK_CAMPAIGNS[0];

  const isFunding = campaign.status === 'FUNDING';

  // Form states
  const [title, setTitle] = useState(campaign.title);
  const [eventDate, setEventDate] = useState(campaign.eventDate);
  const [endDate, setEndDate] = useState(campaign.endDate);
  const [description, setDescription] = useState(campaign.description);
  const [coverImage, setCoverImage] = useState(campaign.coverImage);

  // Updates / Newsfeed for live campaigns
  const [newsUpdate, setNewsUpdate] = useState('');
  const [updatesList, setUpdatesList] = useState<
    { id: string; time: string; content: string }[]
  >([
    {
      id: '1',
      time: '18/11/2026 08:30',
      content: 'Chùa đã hoàn tất may 50 bộ y Ka-thi-na trang nghiêm chuẩn bị cho đại lễ.',
    },
    {
      id: '2',
      time: '16/11/2026 15:00',
      content: 'Ban Trai soạn đã tiếp nhận 2 tấn gạo và rau củ quả do Phật tử cúng dường.',
    },
  ]);

  // Budget items (nếu chưa FUNDING thì cho sửa, nếu đang FUNDING thì khóa)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(campaign.budgetItems);
  const [isSaved, setIsSaved] = useState(false);

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsUpdate.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      time: 'Vừa xong',
      content: newsUpdate.trim(),
    };
    setUpdatesList([newEntry, ...updatesList]);
    setNewsUpdate('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      router.push('/chua/dashboard');
    }, 1200);
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 uppercase">
                {campaign.typeLabel}
              </span>
              <span className="text-xs font-semibold text-emerald-700">
                • Trạng thái: {campaign.status}
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-amber-950">
              Chỉnh Sửa Sự Kiện
            </h1>
          </div>

          <Link
            href={`/su-kien/${campaign.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs font-semibold text-amber-900 shadow-xs hover:bg-amber-50"
          >
            <span>Xem trang công khai</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Business Rule Notice */}
        {isFunding ? (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <Lock className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-amber-950 font-bold mb-0.5">
                Quy tắc bảo vệ niềm tin khi đang nhận cúng dường (FUNDING):
              </strong>
              Để tránh gian lận thay đổi mục tiêu khi tiền của Phật tử đã vào tài khoản, <strong>Bảng dự trù chi phí và Số tài khoản ngân hàng đã được khóa cố định</strong>. Bạn có thể cập nhật mô tả, ảnh bìa, ngày diễn ra và đăng thông báo tin tức cập nhật tiến độ bên dưới.
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              Sự kiện đang ở trạng thái bản thảo (DRAFT) hoặc đang chờ duyệt. Bạn có toàn quyền chỉnh sửa lại các hạng mục trong bảng dự trù chi phí.
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Info Card */}
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-amber-950 text-base border-b border-amber-100 pb-3">
              Thông Tin Sự Kiện
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                Tên sự kiện đại lễ *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-sm font-medium text-amber-950 focus:border-amber-600 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                  Ngày diễn ra đại lễ *
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
                  Ngày đóng quỹ cúng dường *
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
                Link ảnh bìa sự kiện *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-2xl border border-amber-200 px-4 py-2 text-xs font-mono text-amber-950 focus:border-amber-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-amber-900 mb-1">
                Mô tả ý nghĩa và chương trình buổi lễ *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-amber-200 px-4 py-2.5 text-xs sm:text-sm text-amber-950 focus:border-amber-600 focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>

          {/* Budget items (Locked view if FUNDING) */}
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-amber-950 text-base">
                <span>Bảng Dự Trù Chi Phí</span>
                {isFunding && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    <Lock className="h-3 w-3" />
                    <span>Đã Khóa Bảo Mật</span>
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-bold text-amber-900">
                Mục tiêu: {campaign.targetAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-50/50 text-amber-900 border-b border-amber-100 font-semibold">
                  <tr>
                    <th className="px-3 py-2">Hạng mục</th>
                    <th className="px-2 py-2 text-center">Số lượng</th>
                    <th className="px-3 py-2 text-right">Đơn giá</th>
                    <th className="px-3 py-2 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100/70">
                  {budgetItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2.5 font-medium text-amber-950">{item.name}</td>
                      <td className="px-2 py-2.5 text-center font-mono text-amber-800">
                        {item.quantity}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-amber-800">
                        {item.unitPrice.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-amber-950">
                        {item.totalPrice.toLocaleString('vi-VN')} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Progress Updates Feed (Media Updates - Spec Page 10) */}
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-base border-b border-amber-100 pb-3">
              <BellRing className="h-5 w-5 text-amber-700" />
              <span>Đăng Tin Tức Tiến Độ Chuẩn Bị Cho Phật Tử</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập thông báo mới (ví dụ: Chùa đã chuẩn bị xong rạp che, y áo...)..."
                value={newsUpdate}
                onChange={(e) => setNewsUpdate(e.target.value)}
                className="flex-1 rounded-2xl border border-amber-200 px-4 py-2.5 text-xs text-amber-950 focus:border-amber-600 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddUpdate}
                className="rounded-2xl bg-amber-100 px-4 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-200"
              >
                Đăng Tin
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase text-amber-800 block">
                Các bản tin đã cập nhật ({updatesList.length})
              </span>
              {updatesList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3 text-xs"
                >
                  <span className="text-[10px] text-amber-700 block mb-0.5">{item.time}</span>
                  <p className="text-amber-950 font-medium">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
              <Save className="h-4 w-4" />
              <span>{isSaved ? 'Đang Lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditCampaignPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-amber-800">
          Đang tải thông tin chỉnh sửa sự kiện...
        </div>
      }
    >
      <EditCampaignContent />
    </Suspense>
  );
}
