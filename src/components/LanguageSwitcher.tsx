'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { Button } from '@/components/ui/button';

export default function LanguageSwitcher() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = params.locale as Locale;

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;
    
    // Replace the locale in the current pathname
    const segments = pathname.split('/');
    segments[1] = newLocale; // segments[0] is empty, segments[1] is locale
    const newPath = segments.join('/');
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? 'default' : 'outline'}
          size="sm"
          onClick={() => switchLocale(locale)}
          className={
            currentLocale === locale
              ? 'bg-violet-600 hover:bg-violet-700 text-white'
              : 'bg-white hover:bg-slate-50 text-slate-700'
          }
        >
          {localeNames[locale]}
        </Button>
      ))}
    </div>
  );
}

