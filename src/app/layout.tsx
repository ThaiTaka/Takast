import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AudioPlayer from '@/components/AudioPlayer';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'Takash - Nền tảng Đọc & Sáng tác',
  description: 'Đọc truyện, viết truyện và nghe đọc bằng AI với giọng tiếng Việt tự nhiên',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {children}
        <AudioPlayer />
      </body>
    </html>
  );
}
