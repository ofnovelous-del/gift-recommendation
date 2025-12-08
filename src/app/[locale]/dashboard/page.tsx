'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { mockStats, getRecentCustomers, mockSession } from '@/lib/mock-data';

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const { data: session, status } = useSession();
  
  // Redirect sales users to assessment start page
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'SALES') {
      router.push(`/${locale}/assessment/start`);
    }
  }, [status, session, router, locale]);

  // Use session from next-auth if available, otherwise fallback to mock
  const currentSession = session || mockSession;
  const { customerCount, giftCount, questionnaireCount } = mockStats;
  const recentCustomers = getRecentCustomers(5);

  const stats = [
    {
      title: 'ลูกค้าทั้งหมด',
      value: customerCount,
      change: '+12%',
      changeType: 'positive' as const,
      icon: '👥',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'ของขวัญพร้อมขาย',
      value: giftCount,
      change: '+5',
      changeType: 'positive' as const,
      icon: '🎁',
      color: 'text-violet-600',
      bgColor: 'bg-violet-100',
    },
    {
      title: 'แบบสอบถามที่ใช้งาน',
      value: questionnaireCount,
      change: '2',
      changeType: 'neutral' as const,
      icon: '📝',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      title: 'คำแนะนำวันนี้',
      value: 23,
      change: '+8',
      changeType: 'positive' as const,
      icon: '✨',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
  ];

  const quickActions = [
    {
      title: 'เพิ่มลูกค้าใหม่',
      description: 'สร้างโปรไฟล์ลูกค้าและเริ่มแนะนำของขวัญ',
      icon: '➕',
      href: `/${locale}/admin/customers`,
      color: 'from-violet-500 to-purple-600',
    },
    {
      title: 'เริ่มแบบประเมิน',
      description: 'ทำแบบสอบถามเพื่อแนะนำของขวัญ',
      icon: '📋',
      href: `/${locale}/assessment/start`,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'จัดการของขวัญ',
      description: 'เพิ่มและแก้ไขรายการของขวัญ',
      icon: '🎁',
      href: `/${locale}/admin/gifts`,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'ดูรายงาน',
      description: 'วิเคราะห์ข้อมูลและสถิติ',
      icon: '📊',
      href: `/${locale}/admin/reports`,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <AdminLayout userName={currentSession.user?.name || 'User'} userRole={currentSession.user?.role || 'SALES'}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ยินดีต้อนรับ, {currentSession.user?.name}</h1>
          <p className="text-slate-600 mt-1">
            นี่คือภาพรวมของระบบแนะนำของขวัญของคุณ
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  {stat.changeType === 'positive' && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  )}
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">การดำเนินการด่วน</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ลูกค้าล่าสุด</CardTitle>
                  <CardDescription>ลูกค้าที่เพิ่มเข้าระบบล่าสุด</CardDescription>
                </div>
                <Link href={`/${locale}/admin/customers`}>
                  <Button variant="outline" size="sm">ดูทั้งหมด</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCustomers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">ยังไม่มีข้อมูลลูกค้า</p>
                ) : (
                  recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold">
                          {customer.firstName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 text-sm">
                            {customer.firstName} {customer.lastName}
                          </h4>
                          <p className="text-xs text-slate-600">{customer.email || customer.phone}</p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {customer._count.responses} แบบสอบถาม
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>คำแนะนำล่าสุด</CardTitle>
                  <CardDescription>ของขวัญที่แนะนำล่าสุด</CardDescription>
                </div>
                <Link href={`/${locale}/admin/reports`}>
                  <Button variant="outline" size="sm">ดูรายงาน</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Apple AirPods Pro', customer: 'สมชาย ใจดี', date: '15 มี.ค. 2024' },
                  { name: 'Spa Day Package', customer: 'นันทนา สวยงาม', date: '14 มี.ค. 2024' },
                  { name: 'Premium Leather Wallet', customer: 'ประเสริฐ มั่งคั่ง', date: '14 มี.ค. 2024' },
                ].map((rec, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900 text-sm">{rec.name}</h4>
                      <p className="text-xs text-slate-600">สำหรับ {rec.customer}</p>
                    </div>
                    <div className="text-xs text-slate-500">{rec.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>ประสิทธิภาพระบบ</CardTitle>
            <CardDescription>สถิติการใช้งานและประสิทธิภาพ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl font-bold text-violet-600 mb-2">87.5%</div>
                <div className="text-sm text-slate-600">คะแนนความเหมาะสมเฉลี่ย</div>
                <div className="text-xs text-emerald-600 mt-1">↑ +2.3% จากเดือนที่แล้ว</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl font-bold text-emerald-600 mb-2">94%</div>
                <div className="text-sm text-slate-600">อัตราการแปลง</div>
                <div className="text-xs text-emerald-600 mt-1">↑ +5% จากเดือนที่แล้ว</div>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-lg">
                <div className="text-4xl font-bold text-blue-600 mb-2">2.3</div>
                <div className="text-sm text-slate-600">คำแนะนำต่อลูกค้าเฉลี่ย</div>
                <div className="text-xs text-slate-500 mt-1">คงที่</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">คำแนะนำการใช้งาน</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>เริ่มต้นด้วยการเพิ่มลูกค้าใหม่หรือเริ่มแบบประเมิน</li>
                  <li>ใช้ระบบ AI เพื่อวิเคราะห์พฤติกรรมและแนะนำของขวัญ</li>
                  <li>ตรวจสอบรายงานเพื่อดูสถิติและประสิทธิภาพ</li>
                  <li>จัดการแบบสอบถามและของขวัญใน Admin Portal</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
