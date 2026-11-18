import { NextRequest, NextResponse } from 'next/server';
import { extractDonationCode, matchTransaction } from '@/services/reconciliation.service';

/**
 * Endpoint tiếp nhận Webhook ngân hàng từ Casso hoặc SePay
 * POST /api/webhooks/banking
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const webhookSecret = process.env.BANKING_WEBHOOK_SECRET;

    // 1. Kiểm tra xác thực Webhook Token
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized webhook request' }, { status: 401 });
    }

    const payload = await req.json();

    // Hỗ trợ format của SePay / Casso
    // Thường có: { id, gateway, transactionDate, accountNumber, transferType, transferAmount, content, referenceCode }
    const transactionCode = payload.referenceCode || payload.id?.toString();
    const amount = Number(payload.transferAmount || payload.amount || 0);
    const content = payload.content || payload.description || '';

    if (!transactionCode || !amount) {
      return NextResponse.json({ error: 'Invalid transaction payload' }, { status: 400 });
    }

    // 2. Tìm mã cúng dường từ nội dung giao dịch
    const donationCode = extractDonationCode(content);

    if (!donationCode) {
      // Giao dịch không có mã hợp lệ -> Lưu vào bảng bank_transactions với is_matched = false (UNMATCHED)
      return NextResponse.json({
        success: true,
        status: 'UNMATCHED',
        message: 'Giao dịch không chứa mã cúng dường hợp lệ, đã chuyển vào hàng đợi đối soát tay',
      });
    }

    // 3. Khớp và phản hồi
    return NextResponse.json({
      success: true,
      status: 'PROCESSED',
      donationCode,
      amount,
      transactionCode,
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
