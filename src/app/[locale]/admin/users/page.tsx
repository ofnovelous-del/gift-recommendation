'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MARKETING' | 'SALES';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  branch?: string; // สาขาที่ทำงาน
  lastLoginAt?: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@gift.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    status: 'ACTIVE',
    lastLoginAt: '2024-03-15 10:30:00',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'marketing@gift.com',
    firstName: 'Somchai',
    lastName: 'Jaidee',
    role: 'MARKETING',
    status: 'ACTIVE',
    lastLoginAt: '2024-03-14 15:20:00',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    email: 'sales1@gift.com',
    firstName: 'Pranee',
    lastName: 'Sanitwong',
    role: 'SALES',
    status: 'ACTIVE',
    lastLoginAt: '2024-03-15 09:00:00',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    email: 'sales2@gift.com',
    firstName: 'Wichai',
    lastName: 'Konkla',
    role: 'SALES',
    status: 'INACTIVE',
    createdAt: '2024-02-15',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'SALES' as const,
    password: '',
    branch: '',
  });

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

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, user]);
    setShowAddModal(false);
    setNewUser({ email: '', firstName: '', lastName: '', role: 'SALES', password: '', branch: '' });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        };
      }
      return user;
    }));
  };

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-700',
    MARKETING: 'bg-blue-100 text-blue-700',
    SALES: 'bg-green-100 text-green-700',
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    INACTIVE: 'bg-slate-100 text-slate-700',
    SUSPENDED: 'bg-red-100 text-red-700',
  };

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">จัดการผู้ใช้งาน</h1>
            <p className="text-slate-600 mt-1">เพิ่ม แก้ไข และจัดการสิทธิ์ผู้ใช้ในระบบ</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-violet-600 hover:bg-violet-700">
            + เพิ่มผู้ใช้ใหม่
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{users.length}</div>
              <div className="text-sm text-slate-600">ผู้ใช้ทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{users.filter(u => u.status === 'ACTIVE').length}</div>
              <div className="text-sm text-slate-600">ใช้งานอยู่</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600">{users.filter(u => u.role === 'ADMIN').length}</div>
              <div className="text-sm text-slate-600">Admin</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'SALES').length}</div>
              <div className="text-sm text-slate-600">Sales</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="ค้นหาด้วยชื่อหรืออีเมล..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                <option value="all">ทุกบทบาท</option>
                <option value="ADMIN">Admin</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายชื่อผู้ใช้งาน ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-slate-600">ผู้ใช้</th>
                    <th className="pb-3 font-medium text-slate-600">อีเมล</th>
                    <th className="pb-3 font-medium text-slate-600">บทบาท</th>
                    <th className="pb-3 font-medium text-slate-600">สาขา</th>
                    <th className="pb-3 font-medium text-slate-600">สถานะ</th>
                    <th className="pb-3 font-medium text-slate-600">เข้าสู่ระบบล่าสุด</th>
                    <th className="pb-3 font-medium text-slate-600">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold">
                            {user.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-slate-600">{user.email}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600 text-sm">
                        {user.branch ? branches.find(b => b.value === user.branch)?.label || user.branch : '-'}
                      </td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                          {user.status === 'ACTIVE' ? 'ใช้งาน' : user.status === 'INACTIVE' ? 'ไม่ใช้งาน' : 'ระงับ'}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600 text-sm">
                        {user.lastLoginAt || '-'}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">แก้ไข</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleStatus(user.id)}
                            className={user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-700'}
                          >
                            {user.status === 'ACTIVE' ? 'ระงับ' : 'เปิดใช้'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>เพิ่มผู้ใช้ใหม่</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ชื่อ</Label>
                    <Input
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>นามสกุล</Label>
                    <Input
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>อีเมล</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>บทบาท</Label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'ADMIN' | 'MARKETING' | 'SALES' })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="SALES">พนักงานขาย (SALES)</option>
                    <option value="MARKETING">ฝ่ายการตลาด (MARKETING)</option>
                    <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
                  </select>
                </div>
                {newUser.role === 'SALES' && (
                  <div className="space-y-2">
                    <Label>สาขาที่ทำงาน</Label>
                    <select
                      value={newUser.branch}
                      onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {branches.map(branch => (
                        <option key={branch.value} value={branch.value}>{branch.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>รหัสผ่าน</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                    ยกเลิก
                  </Button>
                  <Button onClick={handleAddUser} className="flex-1 bg-violet-600 hover:bg-violet-700">
                    เพิ่มผู้ใช้
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

