'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AdminLayoutProps {
  children: React.ReactNode;
  userRole?: 'ADMIN' | 'MARKETING' | 'SALES';
  userName?: string;
}

const menuItems = [
  { 
    name: 'แดชบอร์ด', 
    href: '/dashboard', 
    icon: '📊',
    roles: ['ADMIN', 'MARKETING', 'SALES']
  },
  { 
    name: 'ลูกค้า', 
    href: '/admin/customers', 
    icon: '👥',
    roles: ['ADMIN', 'MARKETING', 'SALES']
  },
  { 
    name: 'แบบสอบถาม', 
    href: '/admin/questionnaires', 
    icon: '📝',
    roles: ['ADMIN', 'MARKETING']
  },
  { 
    name: 'ของขวัญ', 
    href: '/admin/gifts', 
    icon: '🎁',
    roles: ['ADMIN', 'MARKETING']
  },
  { 
    name: 'ผู้ใช้งาน', 
    href: '/admin/users', 
    icon: '👤',
    roles: ['ADMIN']
  },
  { 
    name: 'ตั้งค่า AI', 
    href: '/admin/ai-config', 
    icon: '🤖',
    roles: ['ADMIN']
  },
  { 
    name: 'รายงาน', 
    href: '/admin/reports', 
    icon: '📈',
    roles: ['ADMIN', 'MARKETING']
  },
  { 
    name: 'ตั้งค่า', 
    href: '/admin/settings', 
    icon: '⚙️',
    roles: ['ADMIN']
  },
];

export default function AdminLayout({ children, userRole = 'ADMIN', userName = 'Admin' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string || 'th';

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="font-bold">GiftGenius</span>
          </Link>
          <button 
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {filteredMenu.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-violet-600 text-white' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-white">{userName}</div>
              <div className="text-xs text-white/60">{userRole}</div>
            </div>
          </div>
          <Link href={`/${locale}/login`}>
            <Button variant="outline" size="sm" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
              ออกจากระบบ
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-sm text-slate-600">
              {new Date().toLocaleDateString('th-TH', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

