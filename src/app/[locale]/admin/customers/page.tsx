'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  ageRange?: string;
  relationship?: string;
  questionnaireCount: number;
  recommendationCount: number;
  lastActivity: string;
  createdAt: string;
  createdBy: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai@example.com',
    phone: '0812345678',
    gender: 'MALE',
    ageRange: '26-35',
    relationship: 'friend',
    questionnaireCount: 2,
    recommendationCount: 2,
    lastActivity: '2024-03-15',
    createdAt: '2024-01-15',
    createdBy: 'Pranee Sanitwong',
  },
  {
    id: '2',
    firstName: 'นันทนา',
    lastName: 'สวยงาม',
    email: 'nantana@example.com',
    phone: '0823456789',
    gender: 'FEMALE',
    ageRange: '26-35',
    relationship: 'colleague',
    questionnaireCount: 1,
    recommendationCount: 1,
    lastActivity: '2024-03-14',
    createdAt: '2024-01-20',
    createdBy: 'Somchai Dejkamol',
  },
  {
    id: '3',
    firstName: 'ประเสริฐ',
    lastName: 'มั่งคั่ง',
    email: 'prasert@example.com',
    phone: '0834567890',
    gender: 'MALE',
    ageRange: '36-50',
    relationship: 'client',
    questionnaireCount: 3,
    recommendationCount: 3,
    lastActivity: '2024-03-15',
    createdAt: '2024-02-01',
    createdBy: 'Pranee Sanitwong',
  },
];

export default function AdminCustomersPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery);
    const matchesGender = filterGender === 'all' || customer.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">จัดการลูกค้า</h1>
            <p className="text-slate-600 mt-1">ดูและจัดการข้อมูลลูกค้าทั้งหมดในระบบ</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700">
            + เพิ่มลูกค้าใหม่
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{customers.length}</div>
              <div className="text-sm text-slate-600">ลูกค้าทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{customers.filter(c => c.questionnaireCount > 0).length}</div>
              <div className="text-sm text-slate-600">ทำแบบสอบถามแล้ว</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600">{customers.reduce((sum, c) => sum + c.recommendationCount, 0)}</div>
              <div className="text-sm text-slate-600">คำแนะนำทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{customers.filter(c => {
                const lastActivity = new Date(c.lastActivity);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return lastActivity >= weekAgo;
              }).length}</div>
              <div className="text-sm text-slate-600">ใช้งาน 7 วันล่าสุด</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือเบอร์โทร..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">ทุกเพศ</option>
                <option value="MALE">ชาย</option>
                <option value="FEMALE">หญิง</option>
                <option value="OTHER">อื่นๆ</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายชื่อลูกค้า ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-slate-600">ลูกค้า</th>
                    <th className="pb-3 font-medium text-slate-600">ข้อมูลติดต่อ</th>
                    <th className="pb-3 font-medium text-slate-600">แบบสอบถาม</th>
                    <th className="pb-3 font-medium text-slate-600">คำแนะนำ</th>
                    <th className="pb-3 font-medium text-slate-600">กิจกรรมล่าสุด</th>
                    <th className="pb-3 font-medium text-slate-600">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            customer.gender === 'MALE' ? 'bg-blue-500' :
                            customer.gender === 'FEMALE' ? 'bg-pink-500' :
                            'bg-slate-500'
                          }`}>
                            {customer.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{customer.firstName} {customer.lastName}</div>
                            <div className="text-xs text-slate-500">
                              {customer.ageRange && `${customer.ageRange} ปี`}
                              {customer.relationship && ` • ${customer.relationship}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-slate-600">
                          {customer.email && <div>{customer.email}</div>}
                          {customer.phone && <div>{customer.phone}</div>}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm">
                          <span className="font-medium text-slate-900">{customer.questionnaireCount}</span>
                          <span className="text-slate-600"> ครั้ง</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm">
                          <span className="font-medium text-slate-900">{customer.recommendationCount}</span>
                          <span className="text-slate-600"> ครั้ง</span>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-slate-600">
                        {customer.lastActivity}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Link href={`/${locale}/admin/customers/${customer.id}`}>
                            <Button variant="outline" size="sm">ดูรายละเอียด</Button>
                          </Link>
                          <Button variant="outline" size="sm">แก้ไข</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

