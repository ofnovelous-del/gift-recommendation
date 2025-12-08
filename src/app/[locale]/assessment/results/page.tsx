'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface GiftRecommendation {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  matchScore: number;
  reasons: string[];
  imageEmoji: string;
}

interface PersonalityProfile {
  type: string;
  name: string;
  description: string;
  traits: string[];
  icon: string;
  color: string;
}

const giftPersonas: Record<string, PersonalityProfile> = {
  experiencer: {
    type: 'experiencer',
    name: 'สายประสบการณ์',
    description: 'ชอบของขวัญที่สร้างความทรงจำและประสบการณ์ใหม่ๆ มากกว่าสิ่งของ',
    traits: ['รักการผจญภัย', 'เปิดรับสิ่งใหม่', 'ให้คุณค่ากับความทรงจำ'],
    icon: '🌟',
    color: 'from-amber-500 to-orange-600',
  },
  practical: {
    type: 'practical',
    name: 'สาย Practical',
    description: 'ชื่นชอบของขวัญที่ใช้งานได้จริงและมีประโยชน์ในชีวิตประจำวัน',
    traits: ['ใส่ใจคุณภาพ', 'ชอบของที่ใช้ได้นาน', 'ไม่ชอบของฟุ่มเฟือย'],
    icon: '🛠️',
    color: 'from-emerald-500 to-teal-600',
  },
  luxury: {
    type: 'luxury',
    name: 'สาย Luxury',
    description: 'ให้ความสำคัญกับคุณภาพพรีเมียม แบรนด์ และความหรูหรา',
    traits: ['ชอบของพิเศษ', 'ใส่ใจรายละเอียด', 'ชื่นชอบความหรูหรา'],
    icon: '✨',
    color: 'from-violet-500 to-purple-600',
  },
  sentimental: {
    type: 'sentimental',
    name: 'สายอารมณ์',
    description: 'ให้ความสำคัญกับความหมายและความตั้งใจมากกว่ามูลค่า',
    traits: ['ซาบซึ้งในความตั้งใจ', 'ชอบของที่มีความหมาย', 'เก็บรักษาความทรงจำ'],
    icon: '💝',
    color: 'from-pink-500 to-rose-600',
  },
};

const sampleRecommendations: GiftRecommendation[] = [
  {
    id: '1',
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'หูฟังไร้สายคุณภาพสูง พร้อมระบบตัดเสียงรบกวน Active Noise Cancellation',
    price: '฿8,900',
    category: 'ELECTRONICS',
    matchScore: 95,
    reasons: ['เหมาะกับคนรักเทคโนโลยี', 'ใช้งานได้ทุกวัน', 'แบรนด์น่าเชื่อถือ'],
    imageEmoji: '🎧',
  },
  {
    id: '2',
    name: 'Spa Day Package - Premium',
    description: 'บัตรสปาครึ่งวัน รวมนวด อบ ซาวน่า และทรีทเมนท์ใบหน้า',
    price: '฿4,500',
    category: 'EXPERIENCE',
    matchScore: 92,
    reasons: ['สร้างประสบการณ์ผ่อนคลาย', 'เหมาะกับคนรักสุขภาพ', 'ของขวัญที่ไม่ซ้ำใคร'],
    imageEmoji: '💆',
  },
  {
    id: '3',
    name: 'Premium Leather Wallet',
    description: 'กระเป๋าสตางค์หนังแท้ งานแฮนด์คราฟต์ ดีไซน์เรียบหรู',
    price: '฿3,200',
    category: 'FASHION',
    matchScore: 88,
    reasons: ['ใช้งานได้ทุกวัน', 'คุณภาพพรีเมียม', 'ดีไซน์ไม่ตกยุค'],
    imageEmoji: '👛',
  },
  {
    id: '4',
    name: 'Personalized Photo Album',
    description: 'อัลบั้มภาพแบบกำหนดเอง พร้อมข้อความและรูปภาพพิเศษ',
    price: '฿1,800',
    category: 'SENTIMENTAL',
    matchScore: 85,
    reasons: ['เก็บความทรงจำพิเศษ', 'แสดงความตั้งใจ', 'ไม่ซ้ำใคร'],
    imageEmoji: '📸',
  },
];

export default function ResultsPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [isLoading, setIsLoading] = useState(true);
  const [recipientInfo, setRecipientInfo] = useState<any>(null);
  const [answers, setAnswers] = useState<any>(null);
  const [persona, setPersona] = useState<PersonalityProfile | null>(null);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
  const [savedToHistory, setSavedToHistory] = useState(false);
  const [cardMessage, setCardMessage] = useState<string>('');
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [aiModelName, setAiModelName] = useState<string>('');
  const [selectedGift, setSelectedGift] = useState<GiftRecommendation | null>(null);

  useEffect(() => {
    // Load data from session storage
    const storedInfo = sessionStorage.getItem('recipientInfo');
    const storedAnswers = sessionStorage.getItem('questionnaireAnswers');
    
    if (storedInfo) setRecipientInfo(JSON.parse(storedInfo));
    if (storedAnswers) setAnswers(JSON.parse(storedAnswers));

    // AI analysis with AI-generated gift recommendations
    setTimeout(async () => {
      try {
        const info = storedInfo ? JSON.parse(storedInfo) : null;
        const ans = storedAnswers ? JSON.parse(storedAnswers) : {};

        // Call AI to generate recommendations
        const response = await fetch('/api/ai/openrouter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'analyzeBehavior',
            answers: ans,
            recipientInfo: info || {},
            useAIGeneratedGifts: true, // Enable AI-generated gift suggestions
          }),
        });

        const data = await response.json();
        
        if (data.success && data.analysis) {
          const analysis = data.analysis;
          
          // Store AI model name
          if (data.modelName) {
            setAiModelName(data.modelName);
          }
          
          // Set persona
          let selectedPersona: PersonalityProfile | null = null;
          if (analysis.persona) {
            const personaType = analysis.persona.type || 'practical';
            selectedPersona = giftPersonas[personaType] || giftPersonas.practical;
            setPersona(selectedPersona);
          }

          // Convert AI recommendations to display format
          if (analysis.recommendations && analysis.recommendations.length > 0) {
            const aiRecommendations: GiftRecommendation[] = analysis.recommendations.map((rec: any, index: number) => ({
              id: `ai-${index + 1}`,
              name: rec.giftName,
              description: rec.description || 'ของขวัญที่แนะนำโดย AI',
              price: rec.priceRange || 'ตามร้านค้า',
              category: rec.category || 'OTHER',
              matchScore: rec.matchScore || 85,
              reasons: rec.reasons || [],
              imageEmoji: getEmojiForCategory(rec.category),
            }));
            setRecommendations(aiRecommendations);
          } else {
            setRecommendations(sampleRecommendations);
          }

          // Generate initial card message (without specific gift)
          const info = storedInfo ? JSON.parse(storedInfo) : null;
          if (info && selectedPersona) {
            generateCardMessage(info, selectedPersona, null);
          }
        } else {
          // Fallback to sample recommendations
          const personaTypes = Object.keys(giftPersonas);
          const randomPersona = personaTypes[Math.floor(Math.random() * personaTypes.length)];
          const selectedPersona = giftPersonas[randomPersona];
          setPersona(selectedPersona);
          setRecommendations(sampleRecommendations);
          
          // Generate initial card message (without specific gift)
          const info = storedInfo ? JSON.parse(storedInfo) : null;
          if (info && selectedPersona) {
            generateCardMessage(info, selectedPersona, null);
          }
        }
      } catch (error) {
        console.error('Error generating AI recommendations:', error);
        // Fallback to sample recommendations
        const personaTypes = Object.keys(giftPersonas);
        const randomPersona = personaTypes[Math.floor(Math.random() * personaTypes.length)];
        const selectedPersona = giftPersonas[randomPersona];
        setPersona(selectedPersona);
        setRecommendations(sampleRecommendations);
        
        // Generate card message
        const info = storedInfo ? JSON.parse(storedInfo) : null;
        if (info && selectedPersona) {
          generateCardMessage(info, selectedPersona);
        }
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  }, []);

  const getEmojiForCategory = (category?: string): string => {
    const emojiMap: Record<string, string> = {
      'ELECTRONICS': '📱',
      'FASHION': '👗',
      'HOME_LIVING': '🏠',
      'FOOD_BEVERAGE': '🍽️',
      'BOOKS_MEDIA': '📚',
      'SPORTS_OUTDOOR': '⚽',
      'BEAUTY_WELLNESS': '💄',
      'TOYS_GAMES': '🎮',
      'JEWELRY_ACCESSORIES': '💎',
      'EXPERIENCE': '✨',
      'SENTIMENTAL': '💝',
    };
    return emojiMap[category || ''] || '🎁';
  };

  const generateCardMessage = async (info: any, personaData: PersonalityProfile, gift?: GiftRecommendation | null) => {
    setIsGeneratingCard(true);
    try {
      const giftToUse = gift || selectedGift;
      const response = await fetch('/api/ai/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateCardMessage',
          recipientInfo: {
            name: info.name,
            relationship: info.relationship || 'เพื่อน',
            occasion: info.occasion || 'วันพิเศษ',
          },
          persona: {
            type: personaData.type,
            name: personaData.name,
            description: personaData.description,
            traits: personaData.traits,
          },
          giftName: giftToUse?.name,
          giftDescription: giftToUse?.description,
          giftReasons: giftToUse?.reasons,
          tone: 'warm',
        }),
      });
      const data = await response.json();
      if (data.success && data.cardMessage) {
        setCardMessage(data.cardMessage);
        if (giftToUse) {
          setSelectedGift(giftToUse);
        }
      }
    } catch (error) {
      console.error('Error generating card message:', error);
      setCardMessage('ขอให้มีความสุขในโอกาสพิเศษนี้');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleSaveToHistory = () => {
    // In a real app, this would save to the database
    setSavedToHistory(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/30" />
            <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              🎁
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">กำลังวิเคราะห์...</h2>
          <p className="text-white/60">AI กำลังประมวลผลข้อมูลเพื่อแนะนำของขวัญที่เหมาะสม</p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveToHistory}
                disabled={savedToHistory}
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                {savedToHistory ? '✓ บันทึกแล้ว' : '💾 บันทึกผลลัพธ์'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              ✨ ผลการวิเคราะห์เสร็จสิ้น
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              คำแนะนำของขวัญสำหรับ
              <span className="text-violet-400"> {recipientInfo?.name || 'ผู้รับ'}</span>
            </h1>
          </div>

          {/* Persona Card */}
          {persona && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${persona.color}`} />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${persona.color} flex items-center justify-center text-3xl`}>
                    {persona.icon}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{persona.name}</CardTitle>
                    <CardDescription className="text-white/60 text-base mt-1">
                      Gift Persona
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{persona.description}</p>
                <div className="flex flex-wrap gap-2">
                  {persona.traits.map((trait, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-white/10 text-white/80 rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Context Info */}
          {recipientInfo && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {recipientInfo.relationship && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-xs text-white/60">ความสัมพันธ์</div>
                  <div className="text-sm font-medium text-white capitalize">{recipientInfo.relationship}</div>
                </div>
              )}
              {recipientInfo.occasion && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">🎉</div>
                  <div className="text-xs text-white/60">โอกาส</div>
                  <div className="text-sm font-medium text-white capitalize">{recipientInfo.occasion}</div>
                </div>
              )}
              {recipientInfo.ageRange && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">🎂</div>
                  <div className="text-xs text-white/60">ช่วงอายุ</div>
                  <div className="text-sm font-medium text-white">{recipientInfo.ageRange} ปี</div>
                </div>
              )}
              {recipientInfo.budget && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-xs text-white/60">งบประมาณ</div>
                  <div className="text-sm font-medium text-white capitalize">{recipientInfo.budget}</div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span>🎁</span>
              ของขวัญที่แนะนำ
            </h2>
            <div className="space-y-4">
              {recommendations.map((gift, index) => (
                <Card key={gift.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-3xl flex-shrink-0">
                        {gift.imageEmoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-300 rounded-full">
                                #{index + 1}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-white/10 text-white/60 rounded-full">
                                {gift.category}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mt-1">{gift.name}</h3>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">{gift.price}</div>
                            <div className="text-xs text-white/60">
                              ความเหมาะสม {gift.matchScore}%
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{gift.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {gift.reasons.map((reason, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full"
                            >
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (recipientInfo && persona) {
                              generateCardMessage(recipientInfo, persona, gift);
                            }
                          }}
                          className="mt-2 bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs"
                        >
                          ✍️ สร้างข้อความการ์ดสำหรับของขวัญนี้
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Card Message Section */}
          {(cardMessage || isGeneratingCard) && (
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <span>💌</span>
                  ข้อความในบัตรของขวัญ
                </CardTitle>
                <CardDescription className="text-white/60">
                  ข้อความที่เหมาะสมกับโอกาสและบุคลิกภาพของผู้รับ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isGeneratingCard ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white/60"></div>
                    <p className="text-white/60 mt-4">กำลังสร้างข้อความ...</p>
                  </div>
                ) : (
                  <div className="p-6 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/90 text-lg leading-relaxed whitespace-pre-line">
                      {cardMessage}
                    </p>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          if (recipientInfo && persona) {
                            generateCardMessage(recipientInfo, persona, selectedGift);
                          }
                        }}
                      >
                        🔄 สร้างข้อความใหม่
                      </Button>
                      {selectedGift && (
                        <div className="text-xs text-white/60 flex items-center gap-2 px-3 py-2 bg-white/5 rounded border border-white/10">
                          <span>📦 ของขวัญที่เลือก:</span>
                          <span className="text-white/80 font-medium">{selectedGift.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/assessment/start`}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                🔄 เริ่มใหม่
              </Button>
            </Link>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              onClick={() => window.print()}
            >
              📄 พิมพ์ / บันทึก PDF
            </Button>
          </div>

          {/* AI Model Info */}
          {aiModelName && (
            <div className="mt-8 p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-white/60 text-center">
                <span className="text-white/80 font-medium">🤖 AI Model:</span> {aiModelName}
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-sm text-white/60">
              💡 คำแนะนำนี้สร้างจากการวิเคราะห์ AI โดยอ้างอิงจากข้อมูลที่ได้รับ
              ผลลัพธ์อาจแตกต่างกันตามความชอบส่วนบุคคลของผู้รับของขวัญ
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

