import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Firebase Chat App',
  description: 'Challenge técnico Next.js + Firebase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
