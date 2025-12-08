'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: 'ระบบแนะนำของขวัญ',
    defaultLocale: 'th',
    maxQuestionCount: 20,
    defaultTemperature: 0.7,
    defaultMaxTokens: 2000,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveMessage('บันทึกการตั้งค่าสำเร็จ');
    setIsSaving(false);
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">ตั้งค่าระบบ</h1>
          <p className="text-slate-600 mt-1">จัดการการตั้งค่าทั่วไปของระบบ</p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>การตั้งค่าทั่วไป</CardTitle>
            <CardDescription>ตั้งค่าพื้นฐานของระบบ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ชื่อระบบ</Label>
              <Input
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>ภาษาเริ่มต้น</Label>
              <select
                value={settings.defaultLocale}
                onChange={(e) => setSettings({ ...settings, defaultLocale: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="th">ไทย</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>จำนวนคำถามสูงสุดต่อแบบสอบถาม</Label>
              <Input
                type="number"
                value={settings.maxQuestionCount}
                onChange={(e) => setSettings({ ...settings, maxQuestionCount: parseInt(e.target.value) })}
                min="5"
                max="50"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI Settings */}
        <Card>
          <CardHeader>
            <CardTitle>การตั้งค่า AI</CardTitle>
            <CardDescription>ตั้งค่าเริ่มต้นสำหรับ AI Models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Temperature เริ่มต้น</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={settings.defaultTemperature}
                  onChange={(e) => setSettings({ ...settings, defaultTemperature: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Tokens เริ่มต้น</Label>
                <Input
                  type="number"
                  value={settings.defaultMaxTokens}
                  onChange={(e) => setSettings({ ...settings, defaultMaxTokens: parseInt(e.target.value) })}
                  min="100"
                  max="8000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>การแจ้งเตือน</CardTitle>
            <CardDescription>ตั้งค่าการแจ้งเตือนต่างๆ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>อีเมลแจ้งเตือน</Label>
                <p className="text-sm text-slate-600">ส่งอีเมลเมื่อมีการสร้างคำแนะนำใหม่</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableEmailNotifications}
                onChange={(e) => setSettings({ ...settings, enableEmailNotifications: e.target.checked })}
                className="w-5 h-5"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SMS แจ้งเตือน</Label>
                <p className="text-sm text-slate-600">ส่ง SMS เมื่อมีการสร้างคำแนะนำใหม่</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableSMSNotifications}
                onChange={(e) => setSettings({ ...settings, enableSMSNotifications: e.target.checked })}
                className="w-5 h-5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          {saveMessage && (
            <div className="flex items-center text-emerald-600">
              <span className="mr-2">✓</span>
              {saveMessage}
            </div>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700">
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}

