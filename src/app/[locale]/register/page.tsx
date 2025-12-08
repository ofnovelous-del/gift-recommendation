'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SALES' as 'ADMIN' | 'MARKETING' | 'SALES',
    branch: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const branches = [
    { value: '', label: 'ไม่ระบุสาขา' },
    { value: 'bangkok-central', label: 'กรุงเทพ - สาขากลาง' },
    { value: 'bangkok-siam', label: 'กรุงเทพ - สาขาสยาม' },
    { value: 'bangkok-emquartier', label: 'กรุงเทพ - สาขา EmQuartier' },
    { value: 'chiangmai', label: 'เชียงใหม่' },
    { value: 'phuket', label: 'ภูเก็ต' },
    { value: 'pattaya', label: 'พัทยา' },
    { value: 'hatyai', label: 'หาดใหญ่' },
    { value: 'online', label: 'ออนไลน์' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('กรุณากรอกชื่อและนามสกุล');
      return;
    }

    if (!formData.email.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (formData.role === 'SALES' && !formData.branch) {
      setError('กรุณาเลือกสาขาสำหรับพนักงานขาย');
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would call an API to create the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          branch: formData.branch || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('สร้างบัญชีสำเร็จ! กรุณาเข้าสู่ระบบ');
        router.push(`/${locale}/login`);
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการสร้างบัญชี');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">สร้างบัญชีใหม่</CardTitle>
          <CardDescription>
            สมัครสมาชิกเพื่อใช้งานระบบแนะนำของขวัญ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อ</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="ชื่อ"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">นามสกุล</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="นามสกุล"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">บทบาท</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'ADMIN' | 'MARKETING' | 'SALES' })}
                className="w-full px-4 py-2 border rounded-lg"
                disabled={isLoading}
              >
                <option value="SALES">พนักงานขาย (SALES)</option>
                <option value="MARKETING">ฝ่ายการตลาด (MARKETING)</option>
                <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
              </select>
            </div>

            {formData.role === 'SALES' && (
              <div className="space-y-2">
                <Label htmlFor="branch">สาขาที่ทำงาน</Label>
                <select
                  id="branch"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  disabled={isLoading}
                >
                  {branches.map(branch => (
                    <option key={branch.value} value={branch.value}>{branch.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                minLength={6}
              />
              <p className="text-xs text-slate-500">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              {isLoading ? 'กำลังสร้างบัญชี...' : 'สร้างบัญชี'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-600">
              มีบัญชีอยู่แล้ว?{' '}
              <Link href={`/${locale}/login`} className="text-violet-600 hover:text-violet-700 font-medium">
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

