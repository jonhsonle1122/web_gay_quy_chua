import { describe, it, expect } from 'vitest';
import { extractDonationCode, matchTransaction } from '@/services/reconciliation.service';

describe('Reconciliation Engine (TDD RED-GREEN)', () => {
  describe('extractDonationCode', () => {
    it('phải trích xuất được mã khi nội dung viết liền CD8F3K2', () => {
      const code = extractDonationCode('KATHINA CD8F3K2 CHUC CHUA AN LAC');
      expect(code).toBe('CD-8F3K2');
    });

    it('phải trích xuất được mã khi có dấu gạch ngang CD-8F3K2', () => {
      const code = extractDonationCode('CHUYEN KHOAN CD-8F3K2 PHAT TU MINH TAM');
      expect(code).toBe('CD-8F3K2');
    });

    it('phải trích xuất được mã khi có khoảng trắng CD 8F3K2 hoặc chữ thường cd8f3k2', () => {
      const code = extractDonationCode('ung ho cd 8f3k2');
      expect(code).toBe('CD-8F3K2');
    });

    it('phải trả về null nếu không có mã cúng dường hợp lệ', () => {
      const code = extractDonationCode('PHAT TU NGUYEN VAN A CUNG DUONG');
      expect(code).toBeNull();
    });
  });

  describe('matchTransaction', () => {
    const existingTransactionCodes = new Set(['MB_EXISTING_123']);

    it('phải khớp thành công khi đúng mã và đủ tiền', () => {
      const donation = {
        id: 'don-1',
        donation_code: 'CD-8F3K2',
        amount: 500000,
        status: 'PENDING' as const,
      };

      const tx = {
        transaction_code: 'MB_NEW_456',
        amount: 500000,
        content: 'KATHINA CD8F3K2',
      };

      const result = matchTransaction(tx, donation, existingTransactionCodes);
      expect(result.status).toBe('MATCHED');
      expect(result.matchedAmount).toBe(500000);
      expect(result.difference).toBe(0);
    });

    it('phải ghi nhận đúng số tiền thực nhận khi Phật tử chuyển thừa', () => {
      const donation = {
        id: 'don-1',
        donation_code: 'CD-8F3K2',
        amount: 500000,
        status: 'PENDING' as const,
      };

      const tx = {
        transaction_code: 'MB_NEW_789',
        amount: 1000000, // Chuyển gấp đôi
        content: 'KATHINA CD8F3K2',
      };

      const result = matchTransaction(tx, donation, existingTransactionCodes);
      expect(result.status).toBe('MATCHED_SURPLUS');
      expect(result.matchedAmount).toBe(1000000);
      expect(result.difference).toBe(500000);
    });

    it('phải cảnh báo khi Phật tử chuyển thiếu', () => {
      const donation = {
        id: 'don-1',
        donation_code: 'CD-8F3K2',
        amount: 500000,
        status: 'PENDING' as const,
      };

      const tx = {
        transaction_code: 'MB_NEW_111',
        amount: 200000, // Chuyển thiếu 300k
        content: 'KATHINA CD8F3K2',
      };

      const result = matchTransaction(tx, donation, existingTransactionCodes);
      expect(result.status).toBe('MATCHED_DEFICIT');
      expect(result.matchedAmount).toBe(200000);
      expect(result.difference).toBe(-300000);
    });

    it('phải từ chối giao dịch trùng lặp (Idempotency check)', () => {
      const donation = {
        id: 'don-1',
        donation_code: 'CD-8F3K2',
        amount: 500000,
        status: 'PENDING' as const,
      };

      const tx = {
        transaction_code: 'MB_EXISTING_123', // Mã này đã có trong DB
        amount: 500000,
        content: 'KATHINA CD8F3K2',
      };

      const result = matchTransaction(tx, donation, existingTransactionCodes);
      expect(result.status).toBe('DUPLICATE_IGNORED');
    });
  });
});
