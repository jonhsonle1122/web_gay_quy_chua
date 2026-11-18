'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  AlertTriangle,
  Building2,
  Calendar,
  CreditCard,
  PhoneCall,
  Lock,
  Unlock,
  History,
  Eye,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'TEMPLES' | 'CAMPAIGNS' | 'REPORTS' | 'COMPLAINTS' | 'AUDIT'>('TEMPLES');

  // 1. Pending Temples
  const [pendingTemples, setPendingTemples] = useState([
    {
      id: 'temple-p1',
      name: 'Chùa Phước Duyên',
      address: 'Xã Phú Dương, TP. Huế, Thừa Thiên Huế',
      representative: 'Đại đức Thích Chơn Trí',
      phone: '0905 112 233',
      bankCode: 'Vietcombank (VCB)',
      accountNumber: '0161001234567',
      accountName: 'CHUA PHUOC DUYEN',
      isNameMatched: true,
      documents: [
        'Giay_chung_nhan_co_so_ton_giao.pdf',
        'Quyet_dinh_bo_nhiem_tru_tri.pdf',
        'Mat_tien_chua_co_bien_hieu.jpg',
      ],
      videoCallVerified: false,
    },
  ]);

  // 2. Pending Campaigns
  const [pendingCampaigns, setPendingCampaigns] = useState([
    {
      id: 'camp-p1',
      templeName: 'Chùa An Lạc (Verified)',
      title: 'Đại Lễ Cúng Dường Trai Tăng 100 Vị Chư Tôn Đức Tăng Ni',
      type: 'Trai Tăng',
      targetAmount: 85000000,
      eventDate: '2026-12-05',
      budgetItems: [
        { name: 'Tịnh tài cúng dường 100 vị Tăng Ni', qty: 100, price: 500000, total: 50000000 },
        { name: 'Ẩm thực chay đãi đại chúng', qty: 1, price: 25000000, total: 25000000 },
        { name: 'Hoa quả và trang trí', qty: 1, price: 10000000, total: 10000000 },
      ],
      surplusPolicy: 'Đưa vào Quỹ từ thiện của chùa',
      status: 'PENDING_REVIEW',
    },
  ]);

  // 3. Pending Reports
  const [pendingReports, setPendingReports] = useState([
    {
      id: 'rep-p1',
      campaignTitle: 'Đại Lễ Dâng Y Kathina PL.2570',
      templeName: 'Chùa An Lạc',
      raised: 102500000,
      spent: 99500000,
      surplus: 3000000,
      receiptsCount: 3,
      livestreamUrl: 'https://youtube.com/watch?v=mock-livestream',
      explanation: 'Buổi lễ viên mãn với 100 vị Tăng Ni. Dư 3 triệu chuyển vào quỹ từ thiện theo cam kết.',
      status: 'PENDING_APPROVAL',
    },
  ]);

  // 4. Complaints & Emergency Suspension
  const [emergencyEvents, setEmergencyEvents] = useState([
    {
      id: 'camp-susp-1',
      title: 'Đại Lễ Dâng Y Kathina PL.2570 - Chùa An Lạc',
      slug: 'dai-le-dang-y-kathina-2026-chua-an-lac',
      status: 'FUNDING',
      complaintsCount: 0,
      isSuspended: false,
    },
    {
      id: 'camp-susp-2',
      title: 'Kêu Gọi Trùng Tu Chánh Điện (Nghi vấn mạo danh)',
      slug: 'trung-tu-chanh-dien-nghi-van',
      status: 'SUSPENDED',
      complaintsCount: 3,
      isSuspended: true,
      reason: 'Có 3 khiếu nại báo cáo tài khoản ngân hàng không phải của chùa. Đang chờ giải trình 72h.',
    },
  ]);

  // 5. Immutable Audit Logs
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log-1',
      time: '18/11/2026 10:45:12',
      actor: 'Admin_SuperUser (001)',
      action: 'APPROVE_TEMPLE_VERIFICATION',
      target: 'Chùa An Lạc (temple-1)',
      detail: 'Đã gọi video call và đối chiếu giấy chứng nhận tôn giáo. Gắn tick xanh Verified.',
    },
    {
      id: 'log-2',
      time: '18/11/2026 11:05:40',
      actor: 'Admin_Inspector (002)',
      action: 'APPROVE_CAMPAIGN_BUDGET',
      target: 'Đại Lễ Dâng Y Kathina 2026 (camp-1)',
      detail: 'Phê duyệt bảng dự trù 150 triệu. Chuyển trạng thái sang FUNDING (Mở VietQR).',
    },
  ]);

  // Action handlers
  const handleVerifyTemple = (id: string, name: string) => {
    alert(`Đã duyệt và cấp Tick Xanh Verified thành công cho: ${name}`);
    setPendingTemples((prev) => prev.filter((t) => t.id !== id));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleString('vi-VN'),
        actor: 'Admin_Current',
        action: 'APPROVE_TEMPLE_VERIFICATION',
        target: name,
        detail: 'Duyệt hồ sơ hợp lệ và gắn tick xanh Verified.',
      },
      ...prev,
    ]);
  };

  const handleApproveCampaign = (id: string, title: string) => {
    alert(`Đã duyệt sự kiện: "${title}". Hệ thống đã mở cúng dường FUNDING và kích hoạt VietQR!`);
    setPendingCampaigns((prev) => prev.filter((c) => c.id !== id));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleString('vi-VN'),
        actor: 'Admin_Current',
        action: 'APPROVE_CAMPAIGN_PUBLISH',
        target: title,
        detail: 'Kiểm duyệt bảng dự trù đạt chuẩn. Chuyển trạng thái sang FUNDING.',
      },
      ...prev,
    ]);
  };

  const handleApproveReport = (id: string, title: string) => {
    alert(`Đã phê duyệt báo cáo thu - chi cho sự kiện: "${title}". Trạng thái chuyển sang CLOSED và công khai vĩnh viễn!`);
    setPendingReports((prev) => prev.filter((r) => r.id !== id));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleString('vi-VN'),
        actor: 'Admin_Current',
        action: 'APPROVE_FINANCIAL_REPORT',
        target: title,
        detail: 'Đối chiếu hóa đơn khớp với đối soát ngân hàng. Đóng sự kiện và công khai vĩnh viễn.',
      },
      ...prev,
    ]);
  };

  const handleToggleSuspend = (id: string) => {
    setEmergencyEvents((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isSuspended;
          const status = nextState ? 'SUSPENDED' : 'FUNDING';
          alert(
            nextState
              ? `ĐÃ KHÓA KHẨN CẤP SỰ KIỆN: "${item.title}". Nút cúng dường và mã VietQR bị vô hiệu hóa lập tức!`
              : `Đã mở khóa sự kiện: "${item.title}". Trạng thái hoạt động bình thường.`
          );
          setAuditLogs((logs) => [
            {
              id: `log-${Date.now()}`,
              time: new Date().toLocaleString('vi-VN'),
              actor: 'Admin_Current',
              action: nextState ? 'EMERGENCY_SUSPEND_CAMPAIGN' : 'UNSUSPEND_CAMPAIGN',
              target: item.title,
              detail: nextState
                ? 'Phát hiện khiếu nại bất thường. Tạm ngắt cổng VietQR để điều tra.'
                : 'Đã hoàn tất giải trình. Cho phép tiếp tục gây quỹ.',
            },
            ...logs,
          ]);
          return { ...item, isSuspended: nextState, status };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20 pt-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-amber-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-900 text-white shadow-md">
              <ShieldCheck className="h-7 w-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-amber-950">
                  Cổng Kiểm Duyệt & Vận Hành (Admin Portal)
                </h1>
                <span className="rounded-full bg-amber-200/80 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-950 uppercase">
                  Quyền Quản Trị
                </span>
              </div>
              <p className="mt-0.5 text-xs text-amber-800">
                Thực thi 3 lớp kiểm duyệt • Chống lừa đảo từ thiết kế • Nhật ký kiểm toán bất biến
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-2xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              ● Hệ thống đang giám sát trực tiếp
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-amber-200 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('TEMPLES')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'TEMPLES'
                ? 'border-amber-700 text-amber-950'
                : 'border-transparent text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>1. Duyệt Chùa (Tick Xanh)</span>
            {pendingTemples.length > 0 && (
              <span className="rounded-full bg-amber-600 px-2 py-0.2 text-[10px] text-white font-mono">
                {pendingTemples.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('CAMPAIGNS')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'CAMPAIGNS'
                ? 'border-amber-700 text-amber-950'
                : 'border-transparent text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>2. Duyệt Sự Kiện & Dự Trù</span>
            {pendingCampaigns.length > 0 && (
              <span className="rounded-full bg-amber-600 px-2 py-0.2 text-[10px] text-white font-mono">
                {pendingCampaigns.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('REPORTS')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'REPORTS'
                ? 'border-amber-700 text-amber-950'
                : 'border-transparent text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>3. Duyệt Báo Cáo Thu - Chi</span>
            {pendingReports.length > 0 && (
              <span className="rounded-full bg-amber-600 px-2 py-0.2 text-[10px] text-white font-mono">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('COMPLAINTS')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'COMPLAINTS'
                ? 'border-rose-600 text-rose-900'
                : 'border-transparent text-amber-800/70 hover:text-rose-900'
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-rose-600" />
            <span>Khóa Khẩn Cấp (SUSPENDED)</span>
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'AUDIT'
                ? 'border-amber-700 text-amber-950'
                : 'border-transparent text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Nhật Ký Kiểm Toán (Audit Logs)</span>
          </button>
        </div>

        {/* Tab 1: Duyệt Chùa */}
        {activeTab === 'TEMPLES' && (
          <div className="space-y-4">
            {pendingTemples.length > 0 ? (
              pendingTemples.map((temple) => (
                <div
                  key={temple.id}
                  className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-amber-950 text-lg">{temple.name}</h3>
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                          Hồ Sơ Mới
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {temple.address} • Đại diện: <strong>{temple.representative}</strong> ({temple.phone})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Tên STK đã khớp 100%</span>
                      </span>
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-amber-50/50 p-4 border border-amber-100 text-xs">
                    <div>
                      <span className="text-amber-700 block">Ngân hàng:</span>
                      <strong className="text-amber-950">{temple.bankCode}</strong>
                    </div>
                    <div>
                      <span className="text-amber-700 block">Số tài khoản:</span>
                      <strong className="font-mono text-amber-950 text-sm">{temple.accountNumber}</strong>
                    </div>
                    <div>
                      <span className="text-amber-700 block">Tên chủ tài khoản:</span>
                      <strong className="font-mono text-amber-950 uppercase">{temple.accountName}</strong>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <span className="text-xs font-bold uppercase text-amber-900 block mb-2">
                      Hồ sơ pháp lý đính kèm:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {temple.documents.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs text-amber-900"
                        >
                          <FileText className="h-3.5 w-3.5 text-amber-700" />
                          <span className="font-mono text-[11px]">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-amber-100">
                    <div className="flex items-center gap-2 text-xs text-amber-800">
                      <PhoneCall className="h-4 w-4 text-emerald-600" />
                      <span>Bước bắt buộc: Gọi video call xác minh khuôn viên và trụ trì trước khi duyệt.</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert('Đã từ chối và gửi yêu cầu bổ sung giấy tờ tới chùa.')}
                        className="rounded-2xl border border-rose-300 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-50"
                      >
                        Từ Chối / Yêu Cầu Sửa
                      </button>
                      <button
                        onClick={() => handleVerifyTemple(temple.id, temple.name)}
                        className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Xác Nhận & Cấp Tick Xanh Verified</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-12 text-center text-xs text-amber-800">
                ✓ Hiện không có hồ sơ chùa nào đang chờ duyệt.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Duyệt Sự Kiện & Bảng Dự Trù */}
        {activeTab === 'CAMPAIGNS' && (
          <div className="space-y-4">
            {pendingCampaigns.length > 0 ? (
              pendingCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                    <div>
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                        {camp.type}
                      </span>
                      <h3 className="font-bold text-amber-950 text-lg mt-1">{camp.title}</h3>
                      <p className="text-xs text-amber-800">Đơn vị tổ chức: {camp.templeName} • Ngày lễ: {camp.eventDate}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-amber-700">Mục tiêu xin gây quỹ:</span>
                      <div className="text-xl font-black text-amber-950 font-mono">
                        {camp.targetAmount.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                  </div>

                  {/* Budget items breakdown */}
                  <div>
                    <span className="text-xs font-bold uppercase text-amber-900 block mb-2">
                      Soát xét bảng dự trù từng hạng mục chi:
                    </span>
                    <div className="overflow-x-auto rounded-2xl border border-amber-100">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-amber-50/60 text-amber-900 font-semibold">
                          <tr>
                            <th className="p-2.5">Hạng mục</th>
                            <th className="p-2.5 text-center">Số lượng</th>
                            <th className="p-2.5 text-right">Đơn giá</th>
                            <th className="p-2.5 text-right">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-100/70">
                          {camp.budgetItems.map((item, idx) => (
                            <tr key={idx}>
                              <td className="p-2.5 font-medium text-amber-950">{item.name}</td>
                              <td className="p-2.5 text-center font-mono text-amber-800">{item.qty}</td>
                              <td className="p-2.5 text-right font-mono text-amber-800">{item.price.toLocaleString('vi-VN')} đ</td>
                              <td className="p-2.5 text-right font-mono font-bold text-amber-950">{item.total.toLocaleString('vi-VN')} đ</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-xl bg-amber-50/60 p-3 text-xs text-amber-900">
                    <strong>Cam kết tiền dư:</strong> {camp.surplusPolicy}.
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex justify-end gap-2 border-t border-amber-100">
                    <button
                      onClick={() => alert('Đã trả về DRAFT kèm ghi chú yêu cầu giải trình đơn giá.')}
                      className="rounded-2xl border border-rose-300 px-4 py-2.5 text-xs font-bold text-rose-800 hover:bg-rose-50"
                    >
                      Yêu Cầu Làm Rõ Dự Trù
                    </button>
                    <button
                      onClick={() => handleApproveCampaign(camp.id, camp.title)}
                      className="flex items-center gap-1.5 rounded-2xl bg-amber-700 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-800"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Duyệt & Mở Cúng Dường (FUNDING)</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-12 text-center text-xs text-amber-800">
                ✓ Hiện không có sự kiện nào đang chờ duyệt.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Duyệt Báo Cáo Thu - Chi */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-4">
            {pendingReports.length > 0 ? (
              pendingReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
                    <div>
                      <h3 className="font-bold text-amber-950 text-lg">{rep.campaignTitle}</h3>
                      <p className="text-xs text-amber-800">Chùa thực hiện: {rep.templeName}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      Nộp Đúng Hạn Trong 7 Ngày
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-2xl bg-amber-50/50 p-4 text-xs font-mono">
                    <div>
                      <span className="text-amber-700 block font-sans">Tổng thu ngân hàng:</span>
                      <strong className="text-emerald-700 text-sm">{rep.raised.toLocaleString('vi-VN')} đ</strong>
                    </div>
                    <div>
                      <span className="text-amber-700 block font-sans">Tổng thực chi:</span>
                      <strong className="text-amber-950 text-sm">{rep.spent.toLocaleString('vi-VN')} đ</strong>
                    </div>
                    <div>
                      <span className="text-amber-700 block font-sans">Tiền còn dư:</span>
                      <strong className="text-amber-800 text-sm">+{rep.surplus.toLocaleString('vi-VN')} đ</strong>
                    </div>
                  </div>

                  <div className="text-xs text-amber-950 space-y-1.5">
                    <p><strong>Giải trình từ chùa:</strong> <em>"{rep.explanation}"</em></p>
                    <p><strong>Hóa đơn chứng từ:</strong> Đã đính kèm {rep.receiptsCount} chứng từ hợp lệ.</p>
                    <p><strong>Video buổi lễ:</strong> <a href={rep.livestreamUrl} target="_blank" className="text-amber-700 underline font-mono">{rep.livestreamUrl}</a></p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-amber-100">
                    <button
                      onClick={() => handleApproveReport(rep.id, rep.campaignTitle)}
                      className="flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Duyệt & Công Khai Báo Cáo Vĩnh Viễn</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-white p-12 text-center text-xs text-amber-800">
                ✓ Hiện không có báo cáo thu - chi nào đang chờ duyệt.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Khóa Khẩn Cấp (SUSPENDED) & Khiếu Nại */}
        {activeTab === 'COMPLAINTS' && (
          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-xs space-y-5">
            <div className="border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <span>Cơ Chế Khóa Khẩn Cấp Sự Kiện (Emergency Suspension)</span>
              </div>
              <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                Theo điều 11 của tài liệu: Khi có dấu hiệu trục lợi hoặc nhận từ 3 khiếu nại độc lập từ Phật tử, Admin có quyền bấm <strong>"Khóa Khẩn Cấp"</strong>. Nút cúng dường và mã VietQR sẽ bị chặn tức thì để bảo vệ nguồn tiền.
              </p>
            </div>

            <div className="space-y-3">
              {emergencyEvents.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                    item.isSuspended
                      ? 'border-rose-400 bg-rose-50/70'
                      : 'border-amber-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-950 text-sm">{item.title}</span>
                      {item.isSuspended ? (
                        <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold text-white">
                          ĐANG BỊ KHÓA (SUSPENDED)
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          Bình thường (FUNDING)
                        </span>
                      )}
                    </div>
                    {item.reason && (
                      <p className="text-xs text-rose-800 font-medium mt-1">
                        Lý do: {item.reason}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleSuspend(item.id)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0 ${
                      item.isSuspended
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-rose-600 text-white hover:bg-rose-700'
                    }`}
                  >
                    {item.isSuspended ? (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        <span>Mở Khóa Sự Kiện</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>Khóa Khẩn Cấp (Ngắt QR)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Audit Logs */}
        {activeTab === 'AUDIT' && (
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xs space-y-4">
            <div className="border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-base">
                <History className="h-5 w-5 text-amber-700" />
                <span>Nhật Ký Kiểm Toán Bất Biến (Immutable Audit Logs)</span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5">
                Mọi hành động kiểm duyệt, phê duyệt tịnh tài và can thiệp đều được ghi chép vĩnh viễn (Trigger SQL chặn mọi lệnh sửa xóa).
              </p>
            </div>

            <div className="divide-y divide-amber-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="text-[11px] text-amber-700 font-mono">{log.time}</span>
                  </div>
                  <div className="font-semibold text-amber-950">
                    Người thực hiện: <span className="text-amber-800">{log.actor}</span> • Đối tượng: <span className="text-amber-950">{log.target}</span>
                  </div>
                  <p className="text-amber-800/90 text-[11px] italic">Chi tiết: "{log.detail}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
