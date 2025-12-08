'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Question {
  id: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'RATING_SCALE' | 'TEXT_INPUT';
  category: string;
  order: number;
  options?: string[];
  isAIGenerated: boolean;
}

interface Questionnaire {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  questionCount: number;
  responseCount: number;
  isDefault: boolean;
  aiGenerated: boolean;
  createdAt: string;
}

const mockQuestionnaires: Questionnaire[] = [
  {
    id: '1',
    title: 'แบบสอบถามทั่วไป - วันเกิด',
    description: 'แบบสอบถามสำหรับการแนะนำของขวัญวันเกิด',
    category: 'Birthday',
    status: 'ACTIVE',
    questionCount: 10,
    responseCount: 156,
    isDefault: true,
    aiGenerated: false,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Big Five Personality Assessment',
    description: 'แบบประเมินบุคลิกภาพ 5 มิติ',
    category: 'Psychology',
    status: 'ACTIVE',
    questionCount: 15,
    responseCount: 89,
    isDefault: false,
    aiGenerated: true,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    title: 'แบบสอบถามสำหรับงานแต่งงาน',
    description: 'แบบสอบถามเฉพาะทางสำหรับของขวัญงานแต่งงาน',
    category: 'Wedding',
    status: 'DRAFT',
    questionCount: 8,
    responseCount: 0,
    isDefault: false,
    aiGenerated: false,
    createdAt: '2024-02-20',
  },
];

const psychologyFrameworks = [
  { id: 'big5', name: 'Big Five Personality', description: 'ประเมินบุคลิกภาพ 5 มิติ: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism', icon: '🧩' },
  { id: 'mbti', name: 'MBTI-Style', description: 'ประเมินประเภทบุคลิกภาพแบบ Introvert/Extrovert, Thinking/Feeling', icon: '🎭' },
  { id: 'values', name: 'Value-Based Assessment', description: 'ประเมินคุณค่าที่ให้ความสำคัญ เช่น ความสำเร็จ ครอบครัว ประสบการณ์', icon: '💎' },
  { id: 'lifestyle', name: 'Lifestyle Mapping', description: 'ประเมินไลฟ์สไตล์และความสนใจ', icon: '🌟' },
  { id: 'gift_preference', name: 'Gift Preference', description: 'ประเมินความชอบของขวัญและพฤติกรรมการซื้อ', icon: '🎁' },
  { id: 'social_style', name: 'Social Style', description: 'ประเมินสไตล์การเข้าสังคมและความสัมพันธ์', icon: '👥' },
];

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>(mockQuestionnaires);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [currentQuestionnaireId, setCurrentQuestionnaireId] = useState<string | null>(null);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [importedQuestions, setImportedQuestions] = useState<string[]>([]);
  const [manualQuestions, setManualQuestions] = useState<Question[]>([]);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    title: '',
    description: '',
    category: 'Birthday',
  });
  const [newManualQuestion, setNewManualQuestion] = useState({
    text: '',
    type: 'SINGLE_CHOICE' as Question['type'],
    options: ['', ''],
  });

  const handleGenerateWithAI = async () => {
    if (selectedFrameworks.length === 0 && !customPrompt) {
      alert('กรุณาเลือก Framework อย่างน้อย 1 ตัว หรือใส่ Custom Prompt');
      return;
    }
    
    setIsGenerating(true);
    try {
      // If custom prompt is provided, use it; otherwise use selected frameworks
      const prompt = customPrompt || `สร้างคำถามโดยใช้ Framework: ${selectedFrameworks.map(f => psychologyFrameworks.find(fw => fw.id === f)?.name).join(', ')}`;
      
      const response = await fetch('/api/ai/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'chatCompletion',
          model: 'openai/gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert psychologist creating assessment questions for a gift recommendation system. Generate clear, concise questions in Thai language. Return only the questions, one per line.',
            },
            {
              role: 'user',
              content: `${prompt}\n\nสร้างคำถาม 10-15 ข้อสำหรับแบบสอบถามแนะนำของขวัญ โดยใช้หลักการทางจิตวิทยาที่ระบุไว้`,
            },
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.response?.choices?.[0]?.message?.content) {
        const content = data.response.choices[0].message.content;
        const questions = content
          .split('\n')
          .map((q: string) => q.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter((q: string) => q.length > 10 && (q.includes('?') || q.includes('? ')))
          .slice(0, 15);
        setGeneratedQuestions(questions);
      } else {
        throw new Error('Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('เกิดข้อผิดพลาดในการสร้างคำถาม กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Parse different file formats
      const questions: string[] = [];
      
      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              if (typeof item === 'string') {
                questions.push(item);
              } else if (item.question || item.text) {
                questions.push(item.question || item.text);
              }
            });
          }
        } catch (error) {
          alert('ไฟล์ JSON ไม่ถูกต้อง');
          return;
        }
      } else if (file.name.endsWith('.csv')) {
        const lines = content.split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed && trimmed.includes('?')) {
            questions.push(trimmed);
          }
        });
      } else {
        // Plain text - one question per line
        const lines = content.split('\n');
        lines.forEach(line => {
          const trimmed = line.replace(/^\d+[\.\)]\s*/, '').trim();
          if (trimmed && trimmed.length > 10) {
            questions.push(trimmed);
          }
        });
      }
      
      setImportedQuestions(questions);
      setGeneratedQuestions([...generatedQuestions, ...questions]);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  const handleApproveQuestions = () => {
    if (generatedQuestions.length === 0) {
      alert('กรุณาสร้างคำถามก่อน');
      return;
    }

    // Convert generated questions to Question format and add to manualQuestions
    const questionsToAdd: Question[] = generatedQuestions.map((q, index) => ({
      id: `ai-q-${Date.now()}-${index}`,
      text: q,
      type: 'SINGLE_CHOICE' as Question['type'],
      category: currentQuestionnaireId 
        ? questionnaires.find(q => q.id === currentQuestionnaireId)?.category || 'General'
        : 'Psychology',
      order: manualQuestions.length + index + 1,
      options: ['ใช่', 'ไม่ใช่', 'ไม่แน่ใจ', 'ไม่ทราบ'],
      isAIGenerated: true,
    }));

    setManualQuestions([...manualQuestions, ...questionsToAdd]);
    setGeneratedQuestions([]);
    setSelectedFrameworks([]);
    setCustomPrompt('');
    setShowAIModal(false);
    
    // If not in question builder, open it
    if (currentQuestionnaireId && !showQuestionBuilder) {
      setShowQuestionBuilder(true);
    }
  };

  const handleAddManualQuestion = () => {
    if (!newManualQuestion.text.trim()) {
      alert('กรุณากรอกคำถาม');
      return;
    }

    if (newManualQuestion.type !== 'TEXT_INPUT' && newManualQuestion.type !== 'RATING_SCALE') {
      const validOptions = newManualQuestion.options.filter(opt => opt.trim());
      if (validOptions.length < 2) {
        alert('กรุณาเพิ่มตัวเลือกอย่างน้อย 2 ตัว');
        return;
      }
    }

    const question: Question = {
      id: `manual-${Date.now()}`,
      text: newManualQuestion.text,
      type: newManualQuestion.type,
      category: currentQuestionnaireId 
        ? questionnaires.find(q => q.id === currentQuestionnaireId)?.category || 'General'
        : newQuestionnaire.category,
      order: manualQuestions.length + 1,
      options: newManualQuestion.type !== 'TEXT_INPUT' && newManualQuestion.type !== 'RATING_SCALE' 
        ? newManualQuestion.options.filter(opt => opt.trim())
        : undefined,
      isAIGenerated: false,
    };

    setManualQuestions([...manualQuestions, question]);
    setNewManualQuestion({
      text: '',
      type: 'SINGLE_CHOICE',
      options: ['', ''],
    });
  };

  const handleSaveQuestions = () => {
    if (manualQuestions.length === 0) {
      alert('กรุณาเพิ่มคำถามอย่างน้อย 1 ข้อ');
      return;
    }

    if (!currentQuestionnaireId) {
      alert('ไม่พบแบบสอบถามที่ต้องการบันทึก');
      return;
    }

    // Update questionnaire with question count
    const updatedQuestionnaires = questionnaires.map(q => {
      if (q.id === currentQuestionnaireId) {
        return {
          ...q,
          questionCount: manualQuestions.length,
          aiGenerated: manualQuestions.some(q => q.isAIGenerated) || q.aiGenerated,
        };
      }
      return q;
    });
    setQuestionnaires(updatedQuestionnaires);

    setShowQuestionBuilder(false);
    setCurrentQuestionnaireId(null);
    setManualQuestions([]);
    setGeneratedQuestions([]);
    alert(`บันทึกคำถาม ${manualQuestions.length} ข้อสำเร็จ!`);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setManualQuestions(
      manualQuestions
        .filter(q => q.id !== questionId)
        .map((q, index) => ({
          ...q,
          order: index + 1,
        }))
    );
  };

  const toggleFramework = (frameworkId: string) => {
    if (selectedFrameworks.includes(frameworkId)) {
      setSelectedFrameworks(selectedFrameworks.filter(f => f !== frameworkId));
    } else {
      setSelectedFrameworks([...selectedFrameworks, frameworkId]);
    }
  };

  const statusColors = {
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    DRAFT: 'bg-amber-100 text-amber-700',
    ARCHIVED: 'bg-slate-100 text-slate-700',
  };

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">จัดการแบบสอบถาม</h1>
            <p className="text-slate-600 mt-1">สร้างและจัดการแบบสอบถามสำหรับการวิเคราะห์พฤติกรรม</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowImportModal(true)}>
              📥 Import คำถาม
            </Button>
            <Button variant="outline" onClick={() => setShowAIModal(true)}>
              🤖 สร้างด้วย AI
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="bg-violet-600 hover:bg-violet-700">
              + สร้างแบบสอบถามใหม่
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{questionnaires.length}</div>
              <div className="text-sm text-slate-600">แบบสอบถามทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{questionnaires.filter(q => q.status === 'ACTIVE').length}</div>
              <div className="text-sm text-slate-600">ใช้งานอยู่</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600">{questionnaires.filter(q => q.aiGenerated).length}</div>
              <div className="text-sm text-slate-600">สร้างโดย AI</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{questionnaires.reduce((sum, q) => sum + q.responseCount, 0)}</div>
              <div className="text-sm text-slate-600">การตอบทั้งหมด</div>
            </CardContent>
          </Card>
        </div>

        {/* Questionnaires Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionnaires.map((q) => (
            <Card 
              key={q.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => {
                // Open edit/view modal
                setNewQuestionnaire({
                  title: q.title,
                  description: q.description,
                  category: q.category,
                });
                setShowCreateModal(true);
              }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[q.status]}`}>
                        {q.status === 'ACTIVE' ? 'ใช้งาน' : q.status === 'DRAFT' ? 'แบบร่าง' : 'เก็บถาวร'}
                      </span>
                      {q.aiGenerated && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                          🤖 AI
                        </span>
                      )}
                      {q.isDefault && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          ⭐ Default
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{q.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{q.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <span>📝 {q.questionCount} คำถาม</span>
                  <span>📊 {q.responseCount} การตอบ</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>หมวดหมู่: {q.category}</span>
                  <span>{q.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewQuestionnaire({
                        title: q.title,
                        description: q.description,
                        category: q.category,
                      });
                      setShowCreateModal(true);
                    }}
                  >
                    แก้ไข
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`ดูคำถามของ: ${q.title}\nจำนวนคำถาม: ${q.questionCount} ข้อ`);
                    }}
                  >
                    ดูคำถาม
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Generation Modal */}
        {showAIModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !generatedQuestions.length) {
                setShowAIModal(false);
                if (currentQuestionnaireId) {
                  setShowQuestionBuilder(true);
                }
              }
            }}
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>🤖 สร้างคำถามด้วย AI</CardTitle>
                    <CardDescription>
                      เลือก Framework ทางจิตวิทยาที่ต้องการ แล้ว AI จะสร้างคำถามตัวอย่างให้คุณตรวจสอบ
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAIModal(false);
                      if (currentQuestionnaireId) {
                        setShowQuestionBuilder(true);
                      }
                    }}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!generatedQuestions.length ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>เลือก Framework ทางจิตวิทยา (เลือกได้หลายตัว)</Label>
                        <div className="grid gap-3">
                          {psychologyFrameworks.map((fw) => (
                            <div
                              key={fw.id}
                              onClick={() => toggleFramework(fw.id)}
                              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                                selectedFrameworks.includes(fw.id)
                                  ? 'border-violet-500 bg-violet-50'
                                  : 'border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedFrameworks.includes(fw.id)}
                                  onChange={() => toggleFramework(fw.id)}
                                  className="w-4 h-4"
                                />
                                <span className="text-xl">{fw.icon}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-slate-900">{fw.name}</div>
                                  <div className="text-sm text-slate-600 mt-1">{fw.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>หรือใส่ Custom Prompt (ถ้าไม่เลือก Framework)</Label>
                        <textarea
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="เช่น สร้างคำถามสำหรับประเมินความชอบของขวัญสำหรับคนรักเทคโนโลยี..."
                          className="w-full px-4 py-2 border rounded-lg resize-none"
                          rows={3}
                        />
                        <p className="text-xs text-slate-500">
                          💡 คุณสามารถใส่ prompt เฉพาะเจาะจงได้ หรือเลือก Framework หลายตัวเพื่อสร้างคำถามที่ครอบคลุม
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => {
                        setShowAIModal(false);
                        setSelectedFrameworks([]);
                        setCustomPrompt('');
                      }} className="flex-1">
                        ยกเลิก
                      </Button>
                      <Button 
                        onClick={handleGenerateWithAI} 
                        disabled={(selectedFrameworks.length === 0 && !customPrompt) || isGenerating}
                        className="flex-1 bg-violet-600 hover:bg-violet-700"
                      >
                        {isGenerating ? '⏳ กำลังสร้าง...' : '🚀 สร้างคำถาม'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Label>คำถามที่สร้างโดย AI (ตรวจสอบก่อนอนุมัติ)</Label>
                      <div className="space-y-2">
                        {generatedQuestions.map((question, index) => (
                          <div key={index} className="p-4 rounded-lg bg-slate-50 border">
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-sm flex items-center justify-center flex-shrink-0">
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <Input 
                                  defaultValue={question}
                                  className="bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <p className="text-sm text-amber-800">
                        💡 คุณสามารถแก้ไขคำถามก่อนอนุมัติ หรือขอให้ AI สร้างใหม่ได้
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setGeneratedQuestions([]);
                          setSelectedFrameworks([]);
                          setCustomPrompt('');
                        }}
                        className="flex-1"
                      >
                        🔄 สร้างใหม่
                      </Button>
                      <Button 
                        onClick={() => {
                          handleApproveQuestions();
                          if (currentQuestionnaireId) {
                            setShowQuestionBuilder(true);
                          }
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        ✓ เพิ่มคำถามเข้าแบบสอบถาม
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>📥 Import คำถาม</CardTitle>
                <CardDescription>
                  นำเข้าคำถามจากไฟล์ JSON, CSV หรือ Text file
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>เลือกไฟล์</Label>
                  <input
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={handleImportFile}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-slate-500">
                    รองรับไฟล์: JSON, CSV, TXT (หนึ่งคำถามต่อบรรทัด)
                  </p>
                </div>
                
                {importedQuestions.length > 0 && (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-800">
                      ✓ นำเข้าคำถาม {importedQuestions.length} ข้อสำเร็จ
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold mb-2">รูปแบบไฟล์ที่รองรับ:</p>
                  <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                    <li><strong>JSON:</strong> [{'{'}"question": "คำถาม1"{'}'}, {'{'}"question": "คำถาม2"{'}'}]</li>
                    <li><strong>CSV:</strong> คำถาม1, คำถาม2, ...</li>
                    <li><strong>TXT:</strong> หนึ่งคำถามต่อบรรทัด</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => {
                    setShowImportModal(false);
                    setImportedQuestions([]);
                  }} className="flex-1">
                    ปิด
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Question Builder Modal */}
        {showQuestionBuilder && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (confirm('คุณต้องการปิดหน้าต่างนี้หรือไม่? คำถามที่ยังไม่ได้บันทึกจะหายไป')) {
                  setShowQuestionBuilder(false);
                  setCurrentQuestionnaireId(null);
                  setManualQuestions([]);
                }
              }
            }}
          >
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>สร้างคำถามสำหรับแบบสอบถาม</CardTitle>
                    <CardDescription>
                      {questionnaires.find(q => q.id === currentQuestionnaireId)?.title || 'แบบสอบถามใหม่'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('คุณต้องการปิดหน้าต่างนี้หรือไม่? คำถามที่ยังไม่ได้บันทึกจะหายไป')) {
                        setShowQuestionBuilder(false);
                        setCurrentQuestionnaireId(null);
                        setManualQuestions([]);
                      }
                    }}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabs for AI vs Manual */}
                <div className="flex gap-4 border-b">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowAIModal(true);
                      setShowQuestionBuilder(false);
                    }}
                    className="rounded-none border-b-2 border-violet-600"
                  >
                    🤖 สร้างด้วย AI
                  </Button>
                  <Button
                    variant="ghost"
                    className="rounded-none"
                  >
                    ✏️ สร้างแบบ Manual
                  </Button>
                </div>

                {/* Manual Question Form */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">เพิ่มคำถามแบบ Manual</h3>
                  <div className="space-y-2">
                    <Label>คำถาม</Label>
                    <Input
                      value={newManualQuestion.text}
                      onChange={(e) => setNewManualQuestion({ ...newManualQuestion, text: e.target.value })}
                      placeholder="เช่น คุณชอบของขวัญแบบไหน?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ประเภทคำถาม</Label>
                    <select
                      value={newManualQuestion.type}
                      onChange={(e) => setNewManualQuestion({ 
                        ...newManualQuestion, 
                        type: e.target.value as Question['type'],
                        options: e.target.value === 'TEXT_INPUT' ? [] : [''],
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="SINGLE_CHOICE">เลือกคำตอบเดียว</option>
                      <option value="MULTIPLE_CHOICE">เลือกหลายคำตอบ</option>
                      <option value="RATING_SCALE">ให้คะแนน (1-5)</option>
                      <option value="TEXT_INPUT">ข้อความ</option>
                    </select>
                  </div>
                  {newManualQuestion.type !== 'TEXT_INPUT' && newManualQuestion.type !== 'RATING_SCALE' && (
                    <div className="space-y-2">
                      <Label>ตัวเลือกคำตอบ</Label>
                      {newManualQuestion.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newManualQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewManualQuestion({ ...newManualQuestion, options: newOptions });
                            }}
                            placeholder={`ตัวเลือก ${index + 1}`}
                          />
                          {newManualQuestion.options.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newOptions = newManualQuestion.options.filter((_, i) => i !== index);
                                setNewManualQuestion({ ...newManualQuestion, options: newOptions });
                              }}
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setNewManualQuestion({ ...newManualQuestion, options: [...newManualQuestion.options, ''] })}
                      >
                        + เพิ่มตัวเลือก
                      </Button>
                    </div>
                  )}
                  <Button
                    onClick={handleAddManualQuestion}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    + เพิ่มคำถาม
                  </Button>
                </div>

                {/* Questions List */}
                {manualQuestions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">คำถามที่เพิ่มแล้ว ({manualQuestions.length} ข้อ)</h3>
                    <div className="space-y-3">
                      {manualQuestions.map((question, index) => (
                        <Card key={question.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-6 h-6 rounded-full bg-violet-600 text-white text-sm flex items-center justify-center">
                                  {index + 1}
                                </span>
                                <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">
                                  {question.type === 'SINGLE_CHOICE' ? 'เลือกคำตอบเดียว' :
                                   question.type === 'MULTIPLE_CHOICE' ? 'เลือกหลายคำตอบ' :
                                   question.type === 'RATING_SCALE' ? 'ให้คะแนน' : 'ข้อความ'}
                                </span>
                                {question.isAIGenerated && (
                                  <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                                    🤖 AI
                                  </span>
                                )}
                              </div>
                              <p className="font-medium text-slate-900">{question.text}</p>
                              {question.options && question.options.length > 0 && (
                                <ul className="mt-2 space-y-1">
                                  {question.options.map((opt, optIndex) => (
                                    <li key={optIndex} className="text-sm text-slate-600">
                                      • {opt}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ลบ
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('คุณต้องการปิดหน้าต่างนี้หรือไม่? คำถามที่ยังไม่ได้บันทึกจะหายไป')) {
                        setShowQuestionBuilder(false);
                        setCurrentQuestionnaireId(null);
                        setManualQuestions([]);
                      }
                    }}
                    className="flex-1"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    onClick={handleSaveQuestions}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    disabled={manualQuestions.length === 0}
                  >
                    💾 บันทึกคำถาม ({manualQuestions.length} ข้อ)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Manual Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>สร้างแบบสอบถามใหม่</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>ชื่อแบบสอบถาม</Label>
                  <Input
                    value={newQuestionnaire.title}
                    onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, title: e.target.value })}
                    placeholder="เช่น แบบสอบถามวันเกิด"
                  />
                </div>
                <div className="space-y-2">
                  <Label>คำอธิบาย</Label>
                  <textarea
                    value={newQuestionnaire.description}
                    onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg resize-none"
                    rows={3}
                    placeholder="อธิบายวัตถุประสงค์ของแบบสอบถาม..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>หมวดหมู่</Label>
                  <select
                    value={newQuestionnaire.category}
                    onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="Birthday">วันเกิด</option>
                    <option value="Anniversary">วันครบรอบ</option>
                    <option value="Wedding">แต่งงาน</option>
                    <option value="Corporate">องค์กร</option>
                    <option value="Psychology">จิตวิทยา</option>
                    <option value="Other">อื่นๆ</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                    ยกเลิก
                  </Button>
                  <Button 
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    onClick={() => {
                      if (!newQuestionnaire.title.trim()) {
                        alert('กรุณากรอกชื่อแบบสอบถาม');
                        return;
                      }
                      // Create new questionnaire
                      const newQ: Questionnaire = {
                        id: Date.now().toString(),
                        title: newQuestionnaire.title,
                        description: newQuestionnaire.description,
                        category: newQuestionnaire.category,
                        status: 'DRAFT',
                        questionCount: 0,
                        responseCount: 0,
                        isDefault: false,
                        aiGenerated: false,
                        createdAt: new Date().toISOString().split('T')[0],
                      };
                      setQuestionnaires([...questionnaires, newQ]);
                      setCurrentQuestionnaireId(newQ.id);
                      setShowCreateModal(false);
                      setShowQuestionBuilder(true);
                      setNewQuestionnaire({ title: '', description: '', category: 'Birthday' });
                      setManualQuestions([]);
                      setGeneratedQuestions([]);
                    }}
                  >
                    สร้างและเพิ่มคำถาม →
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

