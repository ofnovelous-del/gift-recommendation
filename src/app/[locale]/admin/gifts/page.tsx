'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Gift {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceRange: string; // "500-1000", "1000-3000", etc.
  brand: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  tags: string[];
  targetAudience: string[];
  recommendationCount: number;
  imageEmoji: string;
  recommendationReasons: string[]; // เหตุผลที่ควรแนะนำ
  whereToBuy?: string; // ข้อมูลว่าซื้อได้ที่ไหน
  purchaseUrl?: string; // ลิงก์ซื้อสินค้า
}

const mockGifts: Gift[] = [
  {
    id: '1',
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'หูฟังไร้สายคุณภาพสูง พร้อมระบบตัดเสียงรบกวน Active Noise Cancellation',
    category: 'ELECTRONICS',
    price: 8900,
    priceRange: '5000-10000',
    brand: 'Apple',
    status: 'AVAILABLE',
    tags: ['tech-savvy', 'modern', 'premium'],
    targetAudience: ['male', 'female'],
    recommendationCount: 45,
    imageEmoji: '🎧',
    recommendationReasons: ['เหมาะกับคนรักเทคโนโลยี', 'ใช้งานได้ทุกวัน', 'คุณภาพพรีเมียม'],
    whereToBuy: 'Apple Store, Central, Lazada',
    purchaseUrl: 'https://www.apple.com/th/airpods-pro',
  },
  {
    id: '2',
    name: 'Spa Day Package - Premium',
    description: 'บัตรสปาครึ่งวัน รวมนวด อบ ซาวน่า และทรีทเมนท์ใบหน้า',
    category: 'EXPERIENCE',
    price: 4500,
    priceRange: '3000-5000',
    brand: 'Oasis Spa',
    status: 'AVAILABLE',
    tags: ['wellness', 'relaxation', 'luxury'],
    targetAudience: ['female'],
    recommendationCount: 38,
    imageEmoji: '💆',
    recommendationReasons: ['ดีต่อสุขภาพและความผ่อนคลาย', 'ช่วยผ่อนคลาย', 'หรูหราและพิเศษ'],
    whereToBuy: 'Oasis Spa สาขาต่างๆ',
  },
  {
    id: '3',
    name: 'Premium Leather Wallet',
    description: 'กระเป๋าสตางค์หนังแท้ งานแฮนด์คราฟต์ ดีไซน์เรียบหรู',
    category: 'FASHION',
    price: 3200,
    priceRange: '2000-5000',
    brand: 'Bellroy',
    status: 'AVAILABLE',
    tags: ['practical', 'elegant', 'professional'],
    targetAudience: ['male'],
    recommendationCount: 32,
    imageEmoji: '👛',
    recommendationReasons: ['ใช้งานได้จริงในชีวิตประจำวัน', 'เรียบหรูและสวยงาม', 'เหมาะสำหรับมืออาชีพ'],
    whereToBuy: 'Central, Siam Paragon',
  },
  {
    id: '4',
    name: 'Personalized Photo Album',
    description: 'อัลบั้มภาพแบบกำหนดเอง พร้อมข้อความและรูปภาพพิเศษ',
    category: 'SENTIMENTAL',
    price: 1800,
    priceRange: '1000-3000',
    brand: 'Custom Made',
    status: 'AVAILABLE',
    tags: ['sentimental', 'meaningful', 'creative'],
    targetAudience: ['male', 'female'],
    recommendationCount: 28,
    imageEmoji: '📸',
    recommendationReasons: ['มีความหมายและความทรงจำ', 'แสดงความตั้งใจ', 'สร้างสรรค์และไม่ซ้ำใคร'],
    whereToBuy: 'สั่งทำออนไลน์',
  },
  {
    id: '5',
    name: 'Smart Watch - Garmin Venu 3',
    description: 'นาฬิกาสมาร์ทวอทช์สำหรับคนรักสุขภาพ วัดชีพจร ติดตามการนอน',
    category: 'ELECTRONICS',
    price: 15900,
    priceRange: '10000-20000',
    brand: 'Garmin',
    status: 'AVAILABLE',
    tags: ['health', 'tech-savvy', 'active'],
    targetAudience: ['male', 'female'],
    recommendationCount: 24,
    imageEmoji: '⌚',
    recommendationReasons: ['เหมาะกับคนรักสุขภาพ', 'ใช้งานได้ทุกวัน', 'เทคโนโลยีล่าสุด'],
    whereToBuy: 'Garmin Store, Central, Lazada',
  },
  {
    id: '6',
    name: 'Coffee Subscription - 3 Months',
    description: 'กาแฟคั่วสดจากแหล่งปลูกชั้นนำ ส่งถึงบ้านทุกเดือน',
    category: 'FOOD_BEVERAGE',
    price: 2400,
    priceRange: '2000-3000',
    brand: 'Roots Coffee',
    status: 'AVAILABLE',
    tags: ['gourmet', 'practical', 'experience'],
    targetAudience: ['male', 'female'],
    recommendationCount: 18,
    imageEmoji: '☕',
    recommendationReasons: ['เหมาะกับคนรักกาแฟ', 'ได้ลองรสชาติใหม่ทุกเดือน', 'ของขวัญที่ใช้ได้นาน'],
    whereToBuy: 'Roots Coffee Website',
  },
];

const categories = [
  { value: 'ELECTRONICS', label: 'อิเล็กทรอนิกส์', icon: '📱' },
  { value: 'FASHION', label: 'แฟชั่น', icon: '👗' },
  { value: 'HOME_LIVING', label: 'บ้านและที่อยู่อาศัย', icon: '🏠' },
  { value: 'FOOD_BEVERAGE', label: 'อาหารและเครื่องดื่ม', icon: '🍽️' },
  { value: 'BOOKS_MEDIA', label: 'หนังสือและสื่อ', icon: '📚' },
  { value: 'SPORTS_OUTDOOR', label: 'กีฬาและกิจกรรมกลางแจ้ง', icon: '⚽' },
  { value: 'BEAUTY_WELLNESS', label: 'ความงามและสุขภาพ', icon: '💄' },
  { value: 'TOYS_GAMES', label: 'ของเล่นและเกม', icon: '🎮' },
  { value: 'JEWELRY_ACCESSORIES', label: 'เครื่องประดับ', icon: '💎' },
  { value: 'EXPERIENCE', label: 'ประสบการณ์', icon: '✨' },
  { value: 'SENTIMENTAL', label: 'ของที่ระลึก', icon: '💝' },
];

export default function GiftsPage() {
  const [gifts, setGifts] = useState<Gift[]>(mockGifts);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newGift, setNewGift] = useState({
    name: '',
    description: '',
    category: 'ELECTRONICS',
    price: '',
    priceRange: '',
    brand: '',
    tags: '',
    recommendationReasons: '',
    whereToBuy: '',
    purchaseUrl: '',
  });

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = 
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || gift.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || gift.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddGift = () => {
    const gift: Gift = {
      id: Date.now().toString(),
      name: newGift.name,
      description: newGift.description,
      category: newGift.category,
      price: parseInt(newGift.price) || 0,
      priceRange: newGift.priceRange,
      brand: newGift.brand,
      status: 'AVAILABLE',
      tags: newGift.tags.split(',').map(t => t.trim()).filter(Boolean),
      targetAudience: ['male', 'female'],
      recommendationCount: 0,
      imageEmoji: '🎁',
      recommendationReasons: newGift.recommendationReasons.split(',').map(r => r.trim()).filter(Boolean),
      whereToBuy: newGift.whereToBuy || undefined,
      purchaseUrl: newGift.purchaseUrl || undefined,
    };
    setGifts([...gifts, gift]);
    setShowAddModal(false);
    setNewGift({ 
      name: '', 
      description: '', 
      category: 'ELECTRONICS', 
      price: '', 
      priceRange: '',
      brand: '', 
      tags: '',
      recommendationReasons: '',
      whereToBuy: '',
      purchaseUrl: '',
    });
  };

  const handleToggleStatus = (giftId: string) => {
    setGifts(gifts.map(gift => {
      if (gift.id === giftId) {
        return {
          ...gift,
          status: gift.status === 'AVAILABLE' ? 'OUT_OF_STOCK' : 'AVAILABLE',
        };
      }
      return gift;
    }));
  };

  const statusColors = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700',
    OUT_OF_STOCK: 'bg-amber-100 text-amber-700',
    DISCONTINUED: 'bg-red-100 text-red-700',
  };

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">จัดการของขวัญแนะนำ</h1>
            <p className="text-slate-600 mt-1">เพิ่ม แก้ไข และจัดการรายการของขวัญสำหรับแนะนำให้ลูกค้า (ไม่ใช่การขายสินค้า)</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-violet-600 hover:bg-violet-700">
            + เพิ่มของขวัญใหม่
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{gifts.length}</div>
              <div className="text-sm text-slate-600">ของขวัญทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{gifts.filter(g => g.status === 'AVAILABLE').length}</div>
              <div className="text-sm text-slate-600">พร้อมแนะนำ</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600">{gifts.reduce((sum, g) => sum + g.recommendationCount, 0)}</div>
              <div className="text-sm text-slate-600">การแนะนำทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{new Set(gifts.map(g => g.category)).size}</div>
              <div className="text-sm text-slate-600">หมวดหมู่</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อหรือแบรนด์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">ทุกหมวดหมู่</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="AVAILABLE">พร้อมแนะนำ</option>
                <option value="OUT_OF_STOCK">ไม่แนะนำชั่วคราว</option>
                <option value="DISCONTINUED">ยกเลิกการแนะนำ</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Gifts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGifts.map((gift) => (
            <Card key={gift.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-violet-100 flex items-center justify-center text-3xl flex-shrink-0">
                    {gift.imageEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[gift.status]}`}>
                        {gift.status === 'AVAILABLE' ? 'พร้อมแนะนำ' : gift.status === 'OUT_OF_STOCK' ? 'ไม่แนะนำชั่วคราว' : 'ยกเลิกการแนะนำ'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 truncate">{gift.name}</h3>
                    <p className="text-sm text-slate-500">{gift.brand}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mt-3 line-clamp-2">{gift.description}</p>
                
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-violet-600">฿{gift.price.toLocaleString()}</div>
                      <div className="text-xs text-slate-500">แนะนำแล้ว {gift.recommendationCount} ครั้ง</div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {categories.find(c => c.value === gift.category)?.label}
                    </div>
                  </div>
                  
                  {/* Recommendation Reasons */}
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-700 mb-1">เหตุผลที่แนะนำ:</p>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {gift.tags.slice(0, 3).map((tag, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-600">✓</span>
                          <span>
                            {tag === 'tech-savvy' && 'เหมาะกับคนรักเทคโนโลยี'}
                            {tag === 'modern' && 'ดีไซน์ทันสมัย'}
                            {tag === 'premium' && 'คุณภาพพรีเมียม'}
                            {tag === 'wellness' && 'ดีต่อสุขภาพและความผ่อนคลาย'}
                            {tag === 'relaxation' && 'ช่วยผ่อนคลาย'}
                            {tag === 'luxury' && 'หรูหราและพิเศษ'}
                            {tag === 'practical' && 'ใช้งานได้จริงในชีวิตประจำวัน'}
                            {tag === 'elegant' && 'เรียบหรูและสวยงาม'}
                            {tag === 'professional' && 'เหมาะสำหรับมืออาชีพ'}
                            {tag === 'sentimental' && 'มีความหมายและความทรงจำ'}
                            {tag === 'meaningful' && 'แสดงความตั้งใจ'}
                            {tag === 'creative' && 'สร้างสรรค์และไม่ซ้ำใคร'}
                            {!['tech-savvy', 'modern', 'premium', 'wellness', 'relaxation', 'luxury', 'practical', 'elegant', 'professional', 'sentimental', 'meaningful', 'creative'].includes(tag) && tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {gift.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    แก้ไข
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleStatus(gift.id)}
                    className={gift.status === 'AVAILABLE' ? 'text-amber-600' : 'text-emerald-600'}
                  >
                    {gift.status === 'AVAILABLE' ? 'ปิดการแนะนำ' : 'เปิดแนะนำ'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Gift Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>เพิ่มของขวัญใหม่</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ชื่อของขวัญ</Label>
                  <Input
                    value={newGift.name}
                    onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                    placeholder="เช่น Apple AirPods Pro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>คำอธิบาย</Label>
                  <textarea
                    value={newGift.description}
                    onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg resize-none"
                    rows={3}
                    placeholder="รายละเอียดของขวัญ..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>หมวดหมู่</Label>
                    <select
                      value={newGift.category}
                      onChange={(e) => setNewGift({ ...newGift, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>ราคา (บาท)</Label>
                    <Input
                      type="number"
                      value={newGift.price}
                      onChange={(e) => setNewGift({ ...newGift, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>แบรนด์</Label>
                  <Input
                    value={newGift.brand}
                    onChange={(e) => setNewGift({ ...newGift, brand: e.target.value })}
                    placeholder="เช่น Apple, Samsung"
                  />
                </div>
                <div className="space-y-2">
                  <Label>แท็ก (คั่นด้วย comma)</Label>
                  <Input
                    value={newGift.tags}
                    onChange={(e) => setNewGift({ ...newGift, tags: e.target.value })}
                    placeholder="tech, premium, modern"
                  />
                </div>
                <div className="space-y-2">
                  <Label>เหตุผลที่ควรแนะนำ (คั่นด้วย comma)</Label>
                  <Input
                    value={newGift.recommendationReasons}
                    onChange={(e) => setNewGift({ ...newGift, recommendationReasons: e.target.value })}
                    placeholder="เหมาะกับคนรักเทคโนโลยี, ใช้งานได้ทุกวัน, คุณภาพพรีเมียม"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ซื้อได้ที่ (ไม่บังคับ)</Label>
                  <Input
                    value={newGift.whereToBuy}
                    onChange={(e) => setNewGift({ ...newGift, whereToBuy: e.target.value })}
                    placeholder="เช่น Apple Store, Central, Lazada"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ลิงก์ซื้อสินค้า (ไม่บังคับ)</Label>
                  <Input
                    type="url"
                    value={newGift.purchaseUrl}
                    onChange={(e) => setNewGift({ ...newGift, purchaseUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-800">
                    💡 <strong>หมายเหตุ:</strong> ระบบนี้เป็นการแนะนำของขวัญ ไม่ใช่การขายสินค้า 
                    ข้อมูลที่ใส่จะถูกใช้เพื่อแนะนำให้ลูกค้าเลือกซื้อได้อย่างถูกต้อง
                  </p>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                    ยกเลิก
                  </Button>
                  <Button onClick={handleAddGift} className="flex-1 bg-violet-600 hover:bg-violet-700">
                    เพิ่มของขวัญ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

