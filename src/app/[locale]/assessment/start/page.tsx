'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

type Step = 'intro' | 'recipient' | 'occasion';

interface RecipientInfo {
  name: string;
  relationship: string;
  gender: string;
  ageRange: string;
  occasion: string;
  budget: string;
}

export default function AssessmentStartPage() {
  const t = useTranslations();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [step, setStep] = useState<Step>('intro');
  const [recipientInfo, setRecipientInfo] = useState<RecipientInfo>({
    name: '',
    relationship: '',
    gender: '',
    ageRange: '',
    occasion: '',
    budget: '',
  });

  const relationships = [
    { value: 'partner', label: 'คู่รัก / แฟน', icon: '💕' },
    { value: 'family', label: 'ครอบครัว', icon: '👨‍👩‍👧‍👦' },
    { value: 'friend', label: 'เพื่อน', icon: '🤝' },
    { value: 'colleague', label: 'เพื่อนร่วมงาน', icon: '💼' },
    { value: 'boss', label: 'หัวหน้า / ผู้บังคับบัญชา', icon: '👔' },
    { value: 'client', label: 'ลูกค้า', icon: '🤵' },
    { value: 'other', label: 'อื่นๆ', icon: '🎁' },
  ];

  const occasions = [
    { value: 'birthday', label: 'วันเกิด', icon: '🎂' },
    { value: 'anniversary', label: 'วันครบรอบ', icon: '💝' },
    { value: 'wedding', label: 'งานแต่งงาน', icon: '💒' },
    { value: 'graduation', label: 'เรียนจบ', icon: '🎓' },
    { value: 'promotion', label: 'เลื่อนตำแหน่ง', icon: '🎊' },
    { value: 'housewarming', label: 'ขึ้นบ้านใหม่', icon: '🏠' },
    { value: 'thank_you', label: 'ขอบคุณ', icon: '🙏' },
    { value: 'holiday', label: 'เทศกาล / วันหยุด', icon: '🎄' },
    { value: 'no_occasion', label: 'ไม่มีโอกาสพิเศษ', icon: '🎁' },
  ];

  const ageRanges = [
    { value: '0-12', label: 'เด็ก (0-12 ปี)' },
    { value: '13-17', label: 'วัยรุ่น (13-17 ปี)' },
    { value: '18-25', label: 'วัยหนุ่มสาว (18-25 ปี)' },
    { value: '26-35', label: 'วัยทำงานตอนต้น (26-35 ปี)' },
    { value: '36-50', label: 'วัยทำงาน (36-50 ปี)' },
    { value: '51-65', label: 'วัยกลางคน (51-65 ปี)' },
    { value: '65+', label: 'ผู้สูงอายุ (65+ ปี)' },
  ];

  const budgets = [
    { value: 'under_500', label: 'ไม่เกิน 500 บาท', range: '฿0 - ฿500' },
    { value: '500_1000', label: '500 - 1,000 บาท', range: '฿500 - ฿1,000' },
    { value: '1000_3000', label: '1,000 - 3,000 บาท', range: '฿1,000 - ฿3,000' },
    { value: '3000_5000', label: '3,000 - 5,000 บาท', range: '฿3,000 - ฿5,000' },
    { value: '5000_10000', label: '5,000 - 10,000 บาท', range: '฿5,000 - ฿10,000' },
    { value: 'over_10000', label: 'มากกว่า 10,000 บาท', range: '฿10,000+' },
  ];

  const handleNext = () => {
    if (step === 'intro') {
      setStep('recipient');
    } else if (step === 'recipient') {
      setStep('occasion');
    } else {
      // Save to session/state and navigate to questionnaire
      sessionStorage.setItem('recipientInfo', JSON.stringify(recipientInfo));
      router.push(`/${locale}/assessment/questionnaire`);
    }
  };

  const handleBack = () => {
    if (step === 'recipient') {
      setStep('intro');
    } else if (step === 'occasion') {
      setStep('recipient');
    }
  };

  const canProceed = () => {
    if (step === 'intro') return true;
    if (step === 'recipient') {
      return recipientInfo.relationship && recipientInfo.gender && recipientInfo.ageRange;
    }
    if (step === 'occasion') {
      return recipientInfo.occasion && recipientInfo.budget;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-lg">GiftGenius</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">ขั้นตอนที่ {step === 'intro' ? 1 : step === 'recipient' ? 2 : 3} จาก 3</span>
            <span className="text-sm text-white/60">
              {step === 'intro' ? 'แนะนำ' : step === 'recipient' ? 'ข้อมูลผู้รับ' : 'โอกาส & งบประมาณ'}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: step === 'intro' ? '33%' : step === 'recipient' ? '66%' : '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Step: Intro */}
          {step === 'intro' && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="text-6xl mb-4">🎁</div>
                <CardTitle className="text-2xl md:text-3xl text-white">
                  ยินดีต้อนรับสู่ระบบแนะนำของขวัญ
                </CardTitle>
                <CardDescription className="text-white/60 text-base mt-4">
                  เราจะช่วยคุณค้นหาของขวัญที่เหมาะสมที่สุดสำหรับคนพิเศษ
                  โดยใช้ AI วิเคราะห์พฤติกรรมและความชอบ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-white">สิ่งที่คุณจะได้ทำ:</h3>
                  <div className="space-y-3">
                    {[
                      { step: 1, text: 'กรอกข้อมูลพื้นฐานของผู้รับของขวัญ' },
                      { step: 2, text: 'เลือกโอกาสและงบประมาณ' },
                      { step: 3, text: 'ตอบแบบสอบถามเพื่อวิเคราะห์ความชอบ (5-10 นาที)' },
                      { step: 4, text: 'รับคำแนะนำของขวัญที่เหมาะสม' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-center gap-3 text-white/80">
                        <div className="w-8 h-8 rounded-full bg-violet-600/30 flex items-center justify-center text-sm font-semibold text-violet-300">
                          {item.step}
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-300">
                    💡 <strong>หมายเหตุ:</strong> ข้อมูลทั้งหมดจะถูกเก็บรักษาเป็นความลับ 
                    และใช้เพื่อการแนะนำของขวัญเท่านั้น
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Recipient Info */}
          {step === 'recipient' && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">ข้อมูลผู้รับของขวัญ</CardTitle>
                <CardDescription className="text-white/60">
                  กรุณาให้ข้อมูลเบื้องต้นเกี่ยวกับผู้ที่คุณต้องการมอบของขวัญให้
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Name (Optional) */}
                <div className="space-y-2">
                  <Label className="text-white/80">ชื่อ / ชื่อเล่น (ไม่บังคับ)</Label>
                  <Input
                    placeholder="เช่น น้องมิ้นท์, พี่ตุ้ม"
                    value={recipientInfo.name}
                    onChange={(e) => setRecipientInfo({ ...recipientInfo, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                {/* Relationship */}
                <div className="space-y-3">
                  <Label className="text-white/80">ความสัมพันธ์กับผู้รับ <span className="text-red-400">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {relationships.map((rel) => (
                      <button
                        key={rel.value}
                        type="button"
                        onClick={() => setRecipientInfo({ ...recipientInfo, relationship: rel.value })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          recipientInfo.relationship === rel.value
                            ? 'bg-violet-600/30 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg mr-2">{rel.icon}</span>
                        <span className="text-sm">{rel.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                  <Label className="text-white/80">เพศของผู้รับ <span className="text-red-400">*</span></Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'male', label: 'ชาย', icon: '👨' },
                      { value: 'female', label: 'หญิง', icon: '👩' },
                      { value: 'other', label: 'ไม่ระบุ', icon: '🧑' },
                    ].map((gender) => (
                      <button
                        key={gender.value}
                        type="button"
                        onClick={() => setRecipientInfo({ ...recipientInfo, gender: gender.value })}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          recipientInfo.gender === gender.value
                            ? 'bg-violet-600/30 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-2xl mb-1">{gender.icon}</div>
                        <div className="text-sm">{gender.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div className="space-y-3">
                  <Label className="text-white/80">ช่วงอายุ <span className="text-red-400">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {ageRanges.map((age) => (
                      <button
                        key={age.value}
                        type="button"
                        onClick={() => setRecipientInfo({ ...recipientInfo, ageRange: age.value })}
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          recipientInfo.ageRange === age.value
                            ? 'bg-violet-600/30 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {age.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step: Occasion & Budget */}
          {step === 'occasion' && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">โอกาส & งบประมาณ</CardTitle>
                <CardDescription className="text-white/60">
                  บอกเราเกี่ยวกับโอกาสพิเศษและงบประมาณที่คุณตั้งไว้
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Occasion */}
                <div className="space-y-3">
                  <Label className="text-white/80">โอกาสในการให้ของขวัญ <span className="text-red-400">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {occasions.map((occ) => (
                      <button
                        key={occ.value}
                        type="button"
                        onClick={() => setRecipientInfo({ ...recipientInfo, occasion: occ.value })}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          recipientInfo.occasion === occ.value
                            ? 'bg-violet-600/30 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg mr-2">{occ.icon}</span>
                        <span className="text-sm">{occ.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <Label className="text-white/80">งบประมาณ <span className="text-red-400">*</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {budgets.map((budget) => (
                      <button
                        key={budget.value}
                        type="button"
                        onClick={() => setRecipientInfo({ ...recipientInfo, budget: budget.value })}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          recipientInfo.budget === budget.value
                            ? 'bg-violet-600/30 border-violet-500 text-white'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-sm font-medium">{budget.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                {recipientInfo.name && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h4 className="font-medium text-white mb-2">สรุปข้อมูล:</h4>
                    <p className="text-sm text-white/70">
                      คุณกำลังมองหาของขวัญสำหรับ <strong className="text-white">{recipientInfo.name}</strong>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step !== 'intro' ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                ← ย้อนกลับ
              </Button>
            ) : (
              <Link href={`/${locale}`}>
                <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                  ← กลับหน้าหลัก
                </Button>
              </Link>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 disabled:opacity-50"
            >
              {step === 'occasion' ? 'เริ่มแบบสอบถาม →' : 'ถัดไป →'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

