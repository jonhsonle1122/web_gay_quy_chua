import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Cúng Dường Minh Bạch - Trai Tăng & Dâng Y Kathina',
  description:
    'Nền tảng trung gian minh bạch: Chùa đăng sự kiện, Phật tử cúng dường online, tiền về thẳng tài khoản chùa, bắt buộc báo cáo thu - chi công khai sau lễ.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-amber-200 selection:text-amber-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
