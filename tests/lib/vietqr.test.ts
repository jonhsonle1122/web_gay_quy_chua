import { describe, it, expect } from 'vitest';
import { generateDonationCode, formatTransferContent, generateVietQRUrl } from '@/lib/vietqr/generator';

describe('VietQR & Donation Code Generator (TDD RED-GREEN)', () => {
  it('phải sinh mã cúng dường đúng format CD-[5 ký tự Hex]', () => {
    const code = generateDonationCode();
    expect(code).toMatch(/^CD-[A-Z0-9]{5}$/);
  });

  it('phải tạo nội dung chuyển khoản chuẩn Napas không dấu và có khoảng trắng chuẩn', () => {
    const content = formatTransferContent('KATHINA', 'CD-8F3K2');
    expect(content).toBe('KATHINA CD8F3K2');
  });

  it('phải loại bỏ dấu tiếng Việt và ký tự đặc biệt trong tên rút gọn sự kiện', () => {
    const content = formatTransferContent('Trai Tăng 2026!', 'CD-9A1B2');
    expect(content).toBe('TRAITANG2026 CD9A1B2');
  });

  it('phải tạo URL QuickLink VietQR Napas chính xác kèm số tiền và nội dung', () => {
    const url = generateVietQRUrl({
      bankCode: 'MB',
      accountNumber: '0987654321',
      accountName: 'CHUA AN LAC',
      amount: 500000,
      transferContent: 'KATHINA CD8F3K2',
    });

    expect(url).toContain('https://img.vietqr.io/image/MB-0987654321-compact2.png');
    expect(url).toContain('amount=500000');
    expect(url).toContain('addInfo=KATHINA%20CD8F3K2');
    expect(url).toContain('accountName=CHUA%20AN%20LAC');
  });
});
