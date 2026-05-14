import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clean Vent — Чистка вентиляции',
  description: 'Профессиональная чистка и дезинфекция систем вентиляции для бизнеса',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
