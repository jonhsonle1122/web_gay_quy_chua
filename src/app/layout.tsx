import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { DemoBanner } from '@/components/demo-banner';

export const metadata: Metadata = {
  title: 'Cúng Dường Minh Bạch - Trai Tăng & Dâng Y Kathina (Demo Sandbox)',
  description:
    'Môi trường thử nghiệm công nghệ cúng dường minh bạch. Toàn bộ dữ liệu là giả lập phục vụ kiểm thử kỹ thuật.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-stone-50 font-sans text-stone-900 antialiased selection:bg-amber-200 selection:text-amber-900">
        <DemoBanner />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
