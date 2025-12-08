'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReportData {
  period: string;
  totalCustomers: number;
  totalQuestionnaires: number;
  totalRecommendations: number;
  topPersonas: { name: string; count: number }[];
  topCategories: { name: string; count: number }[];
  topGifts: { name: string; count: number }[];
  avgMatchScore: number;
}

const mockReportData: ReportData = {
  period: 'เดือนมีนาคม 2024',
  totalCustomers: 156,
  totalQuestionnaires: 189,
  totalRecommendations: 203,
  topPersonas: [
    { name: 'สายประสบการณ์', count: 68 },
    { name: 'สาย Practical', count: 52 },
    { name: 'สาย Luxury', count: 34 },
    { name: 'สายอารมณ์', count: 19 },
  ],
  topCategories: [
    { name: 'EXPERIENCE', count: 78 },
    { name: 'ELECTRONICS', count: 65 },
    { name: 'FASHION', count: 42 },
    { name: 'BEAUTY_WELLNESS', count: 18 },
  ],
  topGifts: [
    { name: 'Spa Day Package', count: 45 },
    { name: 'Apple AirPods Pro', count: 38 },
    { name: 'Premium Leather Wallet', count: 32 },
    { name: 'Smart Watch', count: 28 },
  ],
  avgMatchScore: 87.5,
};

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportData] = useState<ReportData>(mockReportData);

  const handleExport = (format: 'csv' | 'excel') => {
    // In real app, this would generate and download the file
    alert(`กำลังส่งออกข้อมูลเป็น ${format.toUpperCase()}...`);
  };

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">รายงานและวิเคราะห์</h1>
            <p className="text-slate-600 mt-1">ดูสถิติและข้อมูลเชิงลึกเกี่ยวกับการใช้งานระบบ</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="week">สัปดาห์นี้</option>
              <option value="month">เดือนนี้</option>
              <option value="quarter">ไตรมาสนี้</option>
              <option value="year">ปีนี้</option>
            </select>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              📥 Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              📊 Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{reportData.totalCustomers}</div>
              <div className="text-sm text-slate-600">ลูกค้าใหม่</div>
              <div className="text-xs text-emerald-600 mt-1">+12% จากเดือนที่แล้ว</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{reportData.totalQuestionnaires}</div>
              <div className="text-sm text-slate-600">แบบสอบถามที่ทำ</div>
              <div className="text-xs text-emerald-600 mt-1">+8% จากเดือนที่แล้ว</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{reportData.totalRecommendations}</div>
              <div className="text-sm text-slate-600">คำแนะนำที่สร้าง</div>
              <div className="text-xs text-emerald-600 mt-1">+15% จากเดือนที่แล้ว</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{reportData.avgMatchScore}%</div>
              <div className="text-sm text-slate-600">คะแนนความเหมาะสมเฉลี่ย</div>
              <div className="text-xs text-emerald-600 mt-1">ดีขึ้น 2.3%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Personas */}
          <Card>
            <CardHeader>
              <CardTitle>Gift Personas ที่พบบ่อย</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topPersonas.map((persona, index) => (
                  <div key={persona.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">{persona.name}</span>
                      <span className="text-slate-600">{persona.count} คน</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                        style={{ width: `${(persona.count / reportData.topPersonas[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>หมวดหมู่ของขวัญที่แนะนำบ่อย</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topCategories.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">{category.name}</span>
                      <span className="text-slate-600">{category.count} ครั้ง</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${(category.count / reportData.topCategories[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Gifts */}
        <Card>
          <CardHeader>
            <CardTitle>ของขวัญที่แนะนำบ่อยที่สุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-slate-600">อันดับ</th>
                    <th className="pb-3 font-medium text-slate-600">ชื่อของขวัญ</th>
                    <th className="pb-3 font-medium text-slate-600">จำนวนครั้ง</th>
                    <th className="pb-3 font-medium text-slate-600">% ของทั้งหมด</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reportData.topGifts.map((gift, index) => (
                    <tr key={gift.name} className="hover:bg-slate-50">
                      <td className="py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          index === 0 ? 'bg-amber-100 text-amber-700' :
                          index === 1 ? 'bg-slate-100 text-slate-700' :
                          index === 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-50 text-slate-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 font-medium text-slate-900">{gift.name}</td>
                      <td className="py-4 text-slate-600">{gift.count} ครั้ง</td>
                      <td className="py-4 text-slate-600">
                        {((gift.count / reportData.totalRecommendations) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Analytics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">อัตราการแปลง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 mb-2">
                {((reportData.totalRecommendations / reportData.totalQuestionnaires) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-600">
                จากแบบสอบถาม {reportData.totalQuestionnaires} ครั้ง
                <br />
                สร้างคำแนะนำ {reportData.totalRecommendations} ครั้ง
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ลูกค้าเฉลี่ยต่อวัน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {(reportData.totalCustomers / 30).toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">
                ลูกค้าใหม่ {reportData.totalCustomers} คน
                <br />
                ในช่วงเวลา {reportData.period}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ความพึงพอใจ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {reportData.avgMatchScore}%
              </div>
              <div className="text-sm text-slate-600">
                คะแนนความเหมาะสมเฉลี่ย
                <br />
                จากคำแนะนำทั้งหมด
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>ส่งออกข้อมูล</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => handleExport('csv')} className="justify-start">
                📥 ส่งออกเป็น CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('excel')} className="justify-start">
                📊 ส่งออกเป็น Excel
              </Button>
              <Button variant="outline" className="justify-start">
                📄 สร้างรายงาน PDF
              </Button>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              💡 ข้อมูลที่ส่งออกจะรวม: รายชื่อลูกค้า, ของขวัญที่แนะนำ, พนักงานที่ดูแล, และสถิติการใช้งาน
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

