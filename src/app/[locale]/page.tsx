'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: '🧠',
      titleKey: 'landing.features.aiAnalysis.title',
      descriptionKey: 'landing.features.aiAnalysis.description',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: '🎯',
      titleKey: 'landing.features.personalizedMatching.title',
      descriptionKey: 'landing.features.personalizedMatching.description',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: '📊',
      titleKey: 'landing.features.smartAnalytics.title',
      descriptionKey: 'landing.features.smartAnalytics.description',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const steps = [
    { num: '01', titleKey: 'landing.howItWorks.step1.title', descKey: 'landing.howItWorks.step1.description' },
    { num: '02', titleKey: 'landing.howItWorks.step2.title', descKey: 'landing.howItWorks.step2.description' },
    { num: '03', titleKey: 'landing.howItWorks.step3.title', descKey: 'landing.howItWorks.step3.description' },
    { num: '04', titleKey: 'landing.howItWorks.step4.title', descKey: 'landing.howItWorks.step4.description' },
  ];

  const psychologyFrameworks = [
    { titleKey: 'landing.psychology.bigFive.title', descKey: 'landing.psychology.bigFive.description', icon: '🧩' },
    { titleKey: 'landing.psychology.valueBased.title', descKey: 'landing.psychology.valueBased.description', icon: '💎' },
    { titleKey: 'landing.psychology.lifestyle.title', descKey: 'landing.psychology.lifestyle.description', icon: '🎯' },
    { titleKey: 'landing.psychology.persona.title', descKey: 'landing.psychology.persona.description', icon: '🎭' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-lg tracking-tight">GiftGenius</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link href={`/${locale}/assessment/start`}>
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0">
                  {t('landing.hero.startAssessment')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="inline-block px-4 py-2 mb-6 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                {t('landing.hero.badge')}
              </span>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 ${locale === 'th' ? 'leading-[1.3]' : 'leading-tight'} ${locale === 'th' ? 'tracking-[-0.02em]' : 'tracking-tight'}`}>
                {t('landing.hero.headline')}
                <span className={`block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent ${locale === 'th' ? 'mt-2' : ''}`}>
                  {t('landing.hero.headlineHighlight')}
                </span>
              </h1>
              <p className={`text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto ${locale === 'th' ? 'leading-[2.0]' : 'leading-relaxed'} ${locale === 'th' ? 'space-y-1' : ''}`}>
                {t('landing.hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/${locale}/assessment/start`}>
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 shadow-lg shadow-violet-500/30">
                    {t('landing.hero.startAssessment')}
                  </Button>
                </Link>
                <Link href={`/${locale}/login`}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg bg-white/5 border-white/20 text-white hover:bg-white/10">
                    {t('landing.hero.forSalesStaff')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${locale === 'th' ? 'leading-[1.4]' : 'leading-tight'}`}>{t('landing.features.title')}</h2>
            <p className={`text-white/60 max-w-2xl mx-auto ${locale === 'th' ? 'leading-[2.0]' : 'leading-relaxed'} ${locale === 'th' ? 'mb-2' : ''}`}>
              {t('landing.features.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle className={`text-white text-xl ${locale === 'th' ? 'leading-[1.5] mb-3' : 'leading-tight'}`}>{t(feature.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className={`text-white/60 text-base ${locale === 'th' ? 'leading-[2.0]' : 'leading-relaxed'}`}>
                    {t(feature.descriptionKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${locale === 'th' ? 'leading-[1.4]' : 'leading-tight'}`}>{t('landing.howItWorks.title')}</h2>
            <p className={`text-white/60 max-w-2xl mx-auto ${locale === 'th' ? 'leading-[2.0]' : 'leading-relaxed'} ${locale === 'th' ? 'mb-2' : ''}`}>
              {t('landing.howItWorks.subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative group ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms`, transition: 'all 0.6s ease-out' }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.num}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 ${locale === 'th' ? 'leading-[1.5]' : 'leading-tight'}`}>{t(step.titleKey)}</h3>
                  <p className={`text-white/60 text-sm ${locale === 'th' ? 'leading-[1.9]' : 'leading-relaxed'}`}>{t(step.descKey)}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-violet-600/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Psychology Frameworks */}
      <section className="relative z-10 py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${locale === 'th' ? 'leading-[1.4]' : 'leading-tight'}`}>{t('landing.psychology.title')}</h2>
              <p className={`text-white/60 ${locale === 'th' ? 'leading-[2.0] mb-2' : 'leading-relaxed'}`}>
                {t('landing.psychology.subtitle')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {psychologyFrameworks.map((item, index) => (
                <div key={index} className="flex gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                  <div className="text-3xl flex-shrink-0">{item.icon}</div>
                  <div>
                    <h3 className={`font-semibold text-lg mb-2 ${locale === 'th' ? 'leading-[1.5]' : 'leading-tight'}`}>{t(item.titleKey)}</h3>
                    <p className={`text-white/60 text-sm ${locale === 'th' ? 'leading-[2.0]' : 'leading-relaxed'}`}>{t(item.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-12 rounded-3xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-white/10 backdrop-blur-sm">
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${locale === 'th' ? 'leading-[1.4]' : 'leading-tight'}`}>
                {t('landing.cta.title')}
              </h2>
              <p className={`text-white/70 mb-8 ${locale === 'th' ? 'leading-[2.0]' : 'leading-relaxed'}`}>
                {t('landing.cta.description')}
              </p>
              <Link href={`/${locale}/assessment/start`}>
                <Button size="lg" className="px-10 py-6 text-lg bg-white text-violet-900 hover:bg-white/90">
                  {t('landing.cta.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <span className="font-semibold">GiftGenius</span>
              <span className="text-white/40">© 2024</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href={`/${locale}/about`} className="hover:text-white transition-colors">{t('landing.footer.about')}</Link>
              <Link href={`/${locale}/help`} className="hover:text-white transition-colors">{t('landing.footer.help')}</Link>
              <Link href={`/${locale}/privacy`} className="hover:text-white transition-colors">{t('landing.footer.privacy')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
