import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import { IBM_Plex_Sans, IBM_Plex_Sans_Thai } from 'next/font/google';
import SessionProvider from '@/components/providers/SessionProvider';
import '@/app/globals.css';

const ibmPlexSans = IBM_Plex_Sans({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'thai'],
  variable: '--font-ibm-plex-sans-thai',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  // Use Thai font for Thai locale, English font for English locale
  const fontClass = locale === 'th' 
    ? `${ibmPlexSansThai.variable} ${ibmPlexSansThai.className}`
    : `${ibmPlexSans.variable} ${ibmPlexSans.className}`;

  return (
    <html lang={locale}>
      <body className={fontClass}>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
