import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { searchCustomers } from '@/lib/mock-data';

export default async function CustomersPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  // Using mock data (no database required)
  const searchQuery = q || '';
  const customers = searchCustomers(searchQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">รายการลูกค้า</h1>
              <p className="text-sm text-gray-600">จัดการข้อมูลลูกค้าและประวัติการแนะนำของขวัญ</p>
              <p className="text-xs text-amber-600 mt-1">🔧 โหมดทดสอบ (Mock Data)</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/${locale}/dashboard`}>
                <Button variant="outline">← กลับหน้าหลัก</Button>
              </Link>
              <Button disabled>+ เพิ่มลูกค้าใหม่ (ต้องใช้ DB)</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <form action={`/${locale}/customers`} method="get" className="flex gap-2">
              <Input
                type="search"
                name="q"
                placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือเบอร์โทร..."
                defaultValue={searchQuery}
                className="flex-1"
              />
              <Button type="submit">ค้นหา</Button>
            </form>
          </CardContent>
        </Card>

        {/* Customers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {searchQuery ? 'ไม่พบลูกค้าที่ค้นหา' : 'ยังไม่มีข้อมูลลูกค้าในระบบ'}
                </p>
                {searchQuery && (
                  <Link href={`/${locale}/customers`}>
                    <Button variant="outline">ล้างการค้นหา</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            customers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 font-normal mt-1">
                        {customer.occupation || 'ไม่ระบุอาชีพ'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      customer.gender === 'MALE' ? 'bg-blue-100 text-blue-700' :
                      customer.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {customer.gender === 'MALE' ? 'ชาย' :
                       customer.gender === 'FEMALE' ? 'หญิง' : 'อื่นๆ'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📧</span>
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📱</span>
                        <span>{customer.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-3 text-xs text-gray-500 border-t">
                      <span>แบบสอบถาม: {customer._count.responses}</span>
                      <span>คำแนะนำ: {customer._count.recommendations}</span>
                    </div>

                    <div className="text-xs text-gray-400 pt-2">
                      เพิ่มโดย: {customer.createdBy.firstName} {customer.createdBy.lastName}
                    </div>

                    {/* Tags */}
                    {customer.tags && customer.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2">
                        {customer.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-indigo-50 text-indigo-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" disabled>
                      ดูรายละเอียด
                    </Button>
                    <Button size="sm" disabled>
                      แบบสอบถาม
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {customers.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            แสดง {customers.length} รายการ
            {searchQuery && ` (ค้นหา: "${searchQuery}")`}
          </div>
        )}

        {/* Info Note */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800">
              💡 <strong>หมายเหตุ:</strong> ข้อมูลที่แสดงเป็น Mock Data สำหรับทดสอบ
              ฟีเจอร์เพิ่มลูกค้า, ดูรายละเอียด และแบบสอบถาม จะใช้งานได้เมื่อเชื่อมต่อกับ Database
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
