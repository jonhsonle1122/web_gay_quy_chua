import { BudgetItem } from '@/types/campaign';
import { Calculator } from 'lucide-react';

interface BudgetTableProps {
  items: BudgetItem[];
  targetAmount: number;
}

export function BudgetTable({ items, targetAmount }: BudgetTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/80 bg-white shadow-xs">
      <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50/70 px-4 py-3 sm:px-6">
        <Calculator className="h-4 w-4 text-amber-700" />
        <h3 className="font-bold text-amber-950 text-sm sm:text-base">
          Bảng Dự Trù Chi Phí Công Khai
        </h3>
        <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
          Admin Đã Duyệt Từng Mục
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-amber-100 bg-amber-50/30 text-amber-900 font-semibold">
            <tr>
              <th className="px-4 py-3 sm:px-6">Hạng mục</th>
              <th className="px-3 py-3 text-center">Số lượng</th>
              <th className="px-3 py-3 text-right">Đơn giá</th>
              <th className="px-4 py-3 sm:px-6 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100/70 text-amber-950">
            {items.map((item, idx) => (
              <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                <td className="px-4 py-3 sm:px-6">
                  <div className="font-medium text-amber-950">{item.name}</div>
                  {item.notes && (
                    <div className="text-[11px] text-amber-800/70 mt-0.5">{item.notes}</div>
                  )}
                </td>
                <td className="px-3 py-3 text-center font-mono text-amber-800">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-right font-mono text-amber-800">
                  {item.unitPrice.toLocaleString('vi-VN')} đ
                </td>
                <td className="px-4 py-3 sm:px-6 text-right font-mono font-semibold text-amber-950">
                  {item.totalPrice.toLocaleString('vi-VN')} đ
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-amber-200 bg-amber-50/60 font-bold text-amber-950">
            <tr>
              <td colSpan={3} className="px-4 py-3.5 sm:px-6 text-sm">
                Tổng Mục Tiêu Gây Quỹ Dự Kiến:
              </td>
              <td className="px-4 py-3.5 sm:px-6 text-right font-mono text-base text-amber-800">
                {targetAmount.toLocaleString('vi-VN')} đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
