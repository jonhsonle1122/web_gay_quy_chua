import crypto from 'crypto';

export interface VietQRParams {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transferContent: string;
}

/**
 * Sinh mã cúng dường duy nhất dạng CD-[5 ký tự Hex hoa]
 * Ví dụ: CD-8F3K2
 */
export function generateDonationCode(): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // loại bỏ ký tự dễ nhầm lẫn như I, O
  let randomStr = '';
  const randomBytes = crypto.randomBytes(5);
  for (let i = 0; i < 5; i++) {
    randomStr += chars[randomBytes[i] % chars.length];
  }
  return `CD-${randomStr}`;
}

/**
 * Xóa dấu tiếng Việt và ký tự đặc biệt để đảm bảo app ngân hàng không bị lỗi mã hóa
 */
function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
}

/**
 * Tạo nội dung chuyển khoản chuẩn Napas: [TÊN SỰ KIỆN RÚT GỌN] [MÃ CÚNG DƯỜNG KHÔNG GẠCH]
 * Ví dụ: 'KATHINA CD8F3K2'
 */
export function formatTransferContent(eventPrefix: string, donationCode: string): string {
  const cleanPrefix = removeVietnameseTones(eventPrefix);
  const cleanCode = donationCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  return `${cleanPrefix} ${cleanCode}`.trim();
}

/**
 * Sinh link ảnh VietQR động theo chuẩn QuickLink Napas
 */
export function generateVietQRUrl(params: VietQRParams): string {
  const encodedContent = encodeURIComponent(params.transferContent);
  const encodedName = encodeURIComponent(params.accountName.toUpperCase());
  return `https://img.vietqr.io/image/${params.bankCode}-${params.accountNumber}-compact2.png?amount=${params.amount}&addInfo=${encodedContent}&accountName=${encodedName}`;
}
