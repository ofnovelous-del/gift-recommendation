'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const locale = params.locale as string;
  const callbackUrl = searchParams.get('callbackUrl') || `/${locale}/dashboard`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl,
      });

      console.log('Login result:', result); // Debug log

      if (result?.error) {
        const errorMessage = result.error === 'CredentialsSignin' 
          ? (t('auth.invalidCredentials') || 'Invalid email or password')
          : result.error;
        setError(errorMessage);
      } else if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{t('auth.login')}</CardTitle>
          <CardDescription>
            {t('common.appName')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gift.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('common.loading') : t('auth.signIn')}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/${locale}/register`)}
            >
              สร้างบัญชีใหม่
            </Button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-md text-sm">
            <p className="font-semibold mb-2">Test Accounts:</p>
            <p className="text-xs text-gray-600">Admin: admin@gift.com / password123</p>
            <p className="text-xs text-gray-600">Sales: sales1@gift.com / password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
