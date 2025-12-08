'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  type: 'single_choice' | 'rating' | 'multiple_choice';
  category: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

const psychologyQuestions: Question[] = [
  // Big Five - Openness
  {
    id: 'q1',
    text: 'ผู้รับของขวัญชอบลองสิ่งใหม่ๆ หรือชอบสิ่งที่คุ้นเคยมากกว่า?',
    type: 'rating',
    category: 'openness',
    min: 1,
    max: 5,
  },
  {
    id: 'q2',
    text: 'ผู้รับของขวัญสนใจศิลปะ ดนตรี หรืองานสร้างสรรค์มากน้อยแค่ไหน?',
    type: 'rating',
    category: 'openness',
    min: 1,
    max: 5,
  },
  // Big Five - Extraversion
  {
    id: 'q3',
    text: 'ผู้รับของขวัญชอบเข้าสังคมและพบปะผู้คนมากน้อยแค่ไหน?',
    type: 'rating',
    category: 'extraversion',
    min: 1,
    max: 5,
  },
  {
    id: 'q4',
    text: 'ผู้รับของขวัญชอบกิจกรรมแบบไหนมากกว่า?',
    type: 'single_choice',
    category: 'extraversion',
    options: [
      { value: 'alone', label: '🏠 อยู่บ้าน ทำกิจกรรมคนเดียว' },
      { value: 'small_group', label: '👥 พบปะกลุ่มเล็กๆ' },
      { value: 'big_group', label: '🎉 ปาร์ตี้ งานสังคม' },
    ],
  },
  // Lifestyle
  {
    id: 'q5',
    text: 'งานอดิเรกหรือความสนใจหลักของผู้รับคืออะไร?',
    type: 'multiple_choice',
    category: 'lifestyle',
    options: [
      { value: 'sports', label: '⚽ กีฬา / ออกกำลังกาย' },
      { value: 'travel', label: '✈️ ท่องเที่ยว' },
      { value: 'cooking', label: '🍳 ทำอาหาร' },
      { value: 'reading', label: '📚 อ่านหนังสือ' },
      { value: 'gaming', label: '🎮 เล่นเกม' },
      { value: 'music', label: '🎵 ดนตรี' },
      { value: 'art', label: '🎨 ศิลปะ / งานฝีมือ' },
      { value: 'tech', label: '💻 เทคโนโลยี' },
      { value: 'fashion', label: '👗 แฟชั่น' },
      { value: 'wellness', label: '🧘 สุขภาพ / Wellness' },
    ],
  },
  // Values
  {
    id: 'q6',
    text: 'ผู้รับให้ความสำคัญกับสิ่งใดมากที่สุด?',
    type: 'single_choice',
    category: 'values',
    options: [
      { value: 'experience', label: '✨ ประสบการณ์ใหม่ๆ' },
      { value: 'practicality', label: '🔧 ของใช้ที่เป็นประโยชน์' },
      { value: 'status', label: '💎 ความหรูหรา / สถานะ' },
      { value: 'sentiment', label: '💝 ความหมาย / ความทรงจำ' },
    ],
  },
  // Gift Preferences
  {
    id: 'q7',
    text: 'ผู้รับเคยชื่นชมของขวัญแบบไหนมากที่สุด?',
    type: 'single_choice',
    category: 'gift_preference',
    options: [
      { value: 'surprise', label: '🎁 ของเซอร์ไพรส์ที่ไม่คาดคิด' },
      { value: 'wishlist', label: '📋 ของที่เคยบอกว่าอยากได้' },
      { value: 'practical', label: '🛠️ ของใช้ในชีวิตประจำวัน' },
      { value: 'luxury', label: '✨ ของหรูที่ไม่ค่อยซื้อให้ตัวเอง' },
    ],
  },
  {
    id: 'q8',
    text: 'ผู้รับชอบของขวัญที่เน้นอะไร?',
    type: 'rating',
    category: 'gift_preference',
    min: 1,
    max: 5,
  },
  // Personality
  {
    id: 'q9',
    text: 'ผู้รับเป็นคนวางแผนล่วงหน้า หรือชอบความยืดหยุ่น?',
    type: 'rating',
    category: 'conscientiousness',
    min: 1,
    max: 5,
  },
  {
    id: 'q10',
    text: 'ผู้รับให้ความสำคัญกับสิ่งแวดล้อมและความยั่งยืนมากน้อยแค่ไหน?',
    type: 'rating',
    category: 'values',
    min: 1,
    max: 5,
  },
];

export default function QuestionnairePage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('recipientInfo');
    if (stored) {
      setRecipientInfo(JSON.parse(stored));
    }
  }, []);

  const currentQuestion = psychologyQuestions[currentIndex];
  const progress = ((currentIndex + 1) / psychologyQuestions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleMultipleChoice = (value: string) => {
    const current = answers[currentQuestion.id] || [];
    if (current.includes(value)) {
      setAnswers({ ...answers, [currentQuestion.id]: current.filter((v: string) => v !== value) });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: [...current, value] });
    }
  };

  const handleNext = () => {
    if (currentIndex < psychologyQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit and navigate to results
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Store answers and navigate to results
    sessionStorage.setItem('questionnaireAnswers', JSON.stringify(answers));
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    router.push(`/${locale}/assessment/results`);
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (!answer) return false;
    if (currentQuestion.type === 'multiple_choice') {
      return Array.isArray(answer) && answer.length > 0;
    }
    return true;
  };

  const ratingLabels: Record<number, { left: string; right: string }> = {
    1: { left: 'ชอบสิ่งคุ้นเคย', right: 'ชอบลองใหม่' },
    2: { left: 'ไม่สนใจ', right: 'สนใจมาก' },
    3: { left: 'ชอบอยู่คนเดียว', right: 'ชอบเข้าสังคม' },
    8: { left: 'เน้นคุณภาพ', right: 'เน้นความหมาย' },
    9: { left: 'ยืดหยุ่น', right: 'วางแผนล่วงหน้า' },
    10: { left: 'ไม่สนใจ', right: 'ใส่ใจมาก' },
  };

  const questionIndex = parseInt(currentQuestion.id.replace('q', ''));
  const labels = ratingLabels[questionIndex] || { left: 'น้อย', right: 'มาก' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <span className="font-bold text-lg">GiftGenius</span>
            </Link>
            <div className="text-sm text-white/60">
              {recipientInfo?.name && `สำหรับ: ${recipientInfo.name}`}
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">คำถามที่ {currentIndex + 1} จาก {psychologyQuestions.length}</span>
            <span className="text-sm text-white/60">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-violet-400 mb-2">
                <span className="px-2 py-1 bg-violet-500/20 rounded-full">
                  {currentQuestion.category === 'openness' && '🧠 การเปิดรับประสบการณ์'}
                  {currentQuestion.category === 'extraversion' && '🎭 บุคลิกภาพ'}
                  {currentQuestion.category === 'lifestyle' && '🌟 ไลฟ์สไตล์'}
                  {currentQuestion.category === 'values' && '💎 คุณค่า'}
                  {currentQuestion.category === 'gift_preference' && '🎁 ความชอบของขวัญ'}
                  {currentQuestion.category === 'conscientiousness' && '📋 การวางแผน'}
                </span>
              </div>
              <CardTitle className="text-xl md:text-2xl text-white leading-relaxed">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              {/* Rating Scale */}
              {currentQuestion.type === 'rating' && (
                <div className="space-y-6">
                  <div className="flex justify-between text-sm text-white/60 px-2">
                    <span>{labels.left}</span>
                    <span>{labels.right}</span>
                  </div>
                  <div className="flex justify-center gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAnswer(value)}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-xl text-lg font-semibold transition-all ${
                          answers[currentQuestion.id] === value
                            ? 'bg-violet-600 text-white scale-110 shadow-lg shadow-violet-500/50'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Single Choice */}
              {currentQuestion.type === 'single_choice' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        answers[currentQuestion.id] === option.value
                          ? 'bg-violet-600/30 border-2 border-violet-500 text-white'
                          : 'bg-white/5 border-2 border-transparent text-white/80 hover:bg-white/10'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Multiple Choice */}
              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-4">
                  <p className="text-sm text-white/60 mb-4">เลือกได้มากกว่า 1 ข้อ</p>
                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option) => {
                      const selected = (answers[currentQuestion.id] || []).includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleMultipleChoice(option.value)}
                          className={`p-3 rounded-xl text-left transition-all ${
                            selected
                              ? 'bg-violet-600/30 border-2 border-violet-500 text-white'
                              : 'bg-white/5 border-2 border-transparent text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <span className="text-sm">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
            >
              ← ย้อนกลับ
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 border-0 disabled:opacity-50 min-w-[140px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  กำลังวิเคราะห์...
                </span>
              ) : currentIndex === psychologyQuestions.length - 1 ? (
                'ดูผลลัพธ์ →'
              ) : (
                'ถัดไป →'
              )}
            </Button>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {psychologyQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => answers[psychologyQuestions[index].id] && setCurrentIndex(index)}
                disabled={!answers[psychologyQuestions[index].id] && index !== currentIndex}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-violet-500'
                    : answers[psychologyQuestions[index].id]
                    ? 'bg-violet-500/50 hover:bg-violet-500'
                    : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

