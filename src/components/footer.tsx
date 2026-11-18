import { ShieldAlert, CheckCircle2, FileText, HeartHandshake } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-200/80 bg-amber-100/40 py-12 text-amber-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 3 Cam kết cốt lõi */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-xs">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-amber-950 text-sm">1. Tuyệt đối không giữ tiền</h4>
            <p className="mt-1.5 text-xs text-amber-800/90 leading-relaxed">
              Website không thu phí trung gian, không chuyển hộ tiền. Mã VietQR đưa giao dịch đi thẳng từ app ngân hàng của Phật tử vào STK chính chủ của Chùa.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-xs">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-amber-950 text-sm">2. Xác minh trước khi đăng</h4>
            <p className="mt-1.5 text-xs text-amber-800/90 leading-relaxed">
              Mỗi chùa đều được đối chiếu giấy tờ tôn giáo, quyết định bổ nhiệm và gọi xác minh chéo. Bảng dự trù chi phí được kiểm duyệt từng hạng mục.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white/80 p-5 shadow-xs">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-amber-950 text-sm">3. Bắt buộc báo cáo sau lễ</h4>
            <p className="mt-1.5 text-xs text-amber-800/90 leading-relaxed">
              Không có báo cáo thu - chi kèm hóa đơn chứng từ trong 7 ngày sau lễ, chùa sẽ bị khóa quyền mở sự kiện mới vĩnh viễn. Niềm tin từ con số thực tế.
            </p>
          </div>
        </div>

        {/* Footer Bottom Info */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-amber-200/60 pt-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2 text-xs text-amber-800">
            <HeartHandshake className="h-4 w-4 text-amber-700" />
            <span>Nền tảng công nghệ thiện nguyện hỗ trợ minh bạch Phật sự</span>
          </div>
          <p className="text-xs text-amber-700/80">
            © 2026 Cúng Dường Minh Bạch • Phiên bản MVP v1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
