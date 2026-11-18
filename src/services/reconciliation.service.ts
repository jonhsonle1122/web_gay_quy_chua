export interface BankTransactionInput {
  transaction_code: string;
  amount: number;
  content: string;
}

export interface DonationRecord {
  id: string;
  donation_code: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'MANUAL_CONFIRMED' | 'EXPIRED';
}

export type MatchStatus =
  | 'MATCHED'
  | 'MATCHED_SURPLUS'
  | 'MATCHED_DEFICIT'
  | 'DUPLICATE_IGNORED'
  | 'UNMATCHED';

export interface ReconciliationResult {
  status: MatchStatus;
  matchedAmount: number;
  difference: number;
  donationCode?: string;
  reason?: string;
}

/**
 * Trích xuất mã cúng dường từ chuỗi nội dung chuyển khoản ngân hàng
 * Hỗ trợ các biến thể: CD8F3K2, CD-8F3K2, CD 8F3K2, cd8f3k2,...
 */
export function extractDonationCode(content: string): string | null {
  if (!content) return null;
  const regex = /CD[\s-_]?([A-Z0-9]{5})/i;
  const match = content.match(regex);
  if (!match) return null;

  return `CD-${match[1].toUpperCase()}`;
}

/**
 * Thuật toán đối soát giao dịch ngân hàng theo quy chuẩn nghiệp vụ spec v1.0
 */
export function matchTransaction(
  tx: BankTransactionInput,
  donation: DonationRecord,
  existingTransactionCodes: Set<string>
): ReconciliationResult {
  // 1. Chống lặp giao dịch (Idempotency)
  if (existingTransactionCodes.has(tx.transaction_code)) {
    return {
      status: 'DUPLICATE_IGNORED',
      matchedAmount: 0,
      difference: 0,
      reason: 'Mã giao dịch ngân hàng đã được xử lý trước đó',
    };
  }

  // 2. Tính chênh lệch
  const difference = tx.amount - donation.amount;

  if (difference === 0) {
    return {
      status: 'MATCHED',
      matchedAmount: tx.amount,
      difference: 0,
      donationCode: donation.donation_code,
    };
  }

  if (difference > 0) {
    // Chuyển thừa: Ghi nhận đúng số thực nhận, chênh lệch đưa vào minh bạch
    return {
      status: 'MATCHED_SURPLUS',
      matchedAmount: tx.amount,
      difference,
      donationCode: donation.donation_code,
      reason: `Chuyển thừa ${difference.toLocaleString('vi-VN')} đ`,
    };
  }

  // Chuyển thiếu
  return {
    status: 'MATCHED_DEFICIT',
    matchedAmount: tx.amount,
    difference,
    donationCode: donation.donation_code,
    reason: `Chuyển thiếu ${Math.abs(difference).toLocaleString('vi-VN')} đ`,
  };
}
