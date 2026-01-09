import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/app/Context/LanguageContext';

const jostSans = Jost({
  variable: '--font-jost-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SchemeSaathi - Government Schemes for Indian Citizens',
  description:
    'Multilingual WhatsApp chatbot helping Indian citizens discover government schemes they are eligible for. Supports 24+ Indian languages.',
  keywords: 'government schemes, India, WhatsApp bot, multilingual, PM-KISAN, Ayushman Bharat, eligibility',
  authors: [{ name: 'SchemeSaathi Team' }],
  openGraph: {
    title: 'SchemeSaathi - Government Schemes for Indian Citizens',
    description: 'Discover government schemes in your language through WhatsApp',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jostSans.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
