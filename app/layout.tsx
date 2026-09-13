import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FSP Terminology — Medizinisches Deutsch für die Fachsprachprüfung',
  description:
    'Trainiere Fachbegriffe, Patientensprache und klinische Formulierungen mit realistischen FSP-Aufgaben. Gezielte Vorbereitung auf die Fachsprachprüfung.',
  openGraph: {
    title: 'FSP Terminology',
    description:
      'Medizinisches Deutsch für die Fachsprachprüfung — gezielt trainieren, sicher bestehen.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
