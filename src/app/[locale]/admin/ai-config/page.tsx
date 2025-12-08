'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AIConfig {
  id: string;
  provider: 'OPENAI' | 'CLAUDE' | 'GEMINI' | 'CUSTOM' | 'OPENROUTER';
  modelName: string;
  isActive: boolean;
  isDefault: boolean;
  temperature: number;
  maxTokens: number;
  requestCount: number;
  lastUsedAt?: string;
  apiEndpoint?: string;
}

const mockConfigs: AIConfig[] = [
  {
    id: '1',
    provider: 'OPENROUTER',
    modelName: 'openai/gpt-4-turbo',
    isActive: true,
    isDefault: true,
    temperature: 0.7,
    maxTokens: 2000,
    requestCount: 0,
    lastUsedAt: undefined,
    apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
  },
  {
    id: '2',
    provider: 'CLAUDE',
    modelName: 'claude-3-opus',
    isActive: true,
    isDefault: false,
    temperature: 0.8,
    maxTokens: 3000,
    requestCount: 892,
    lastUsedAt: '2024-03-15 13:15:00',
  },
  {
    id: '3',
    provider: 'GEMINI',
    modelName: 'gemini-pro',
    isActive: false,
    isDefault: false,
    temperature: 0.6,
    maxTokens: 2500,
    requestCount: 234,
    lastUsedAt: '2024-03-10 10:00:00',
  },
];

const providerInfo = {
  OPENROUTER: {
    name: 'OpenRouter',
    icon: '🌐',
    color: 'bg-indigo-100 text-indigo-700',
    models: [
      'openai/gpt-4-turbo',
      'openai/gpt-4',
      'openai/gpt-3.5-turbo',
      'anthropic/claude-3-opus',
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-haiku',
      'google/gemini-pro',
      'meta-llama/llama-3-70b-instruct',
      'mistralai/mistral-large',
    ],
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  },
  OPENAI: {
    name: 'OpenAI',
    icon: '🤖',
    color: 'bg-emerald-100 text-emerald-700',
    models: ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'],
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
  CLAUDE: {
    name: 'Anthropic Claude',
    icon: '🧠',
    color: 'bg-violet-100 text-violet-700',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  GEMINI: {
    name: 'Google Gemini',
    icon: '💎',
    color: 'bg-blue-100 text-blue-700',
    models: ['gemini-pro', 'gemini-ultra'],
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
  },
  CUSTOM: {
    name: 'Custom API',
    icon: '⚙️',
    color: 'bg-slate-100 text-slate-700',
    models: [],
    endpoint: '',
  },
};

export default function AIConfigPage() {
  const [configs, setConfigs] = useState<AIConfig[]>(mockConfigs);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AIConfig | null>(null);
  const [newConfig, setNewConfig] = useState<{
    provider: 'OPENAI' | 'CLAUDE' | 'GEMINI' | 'CUSTOM' | 'OPENROUTER';
    modelName: string;
    temperature: number;
    maxTokens: number;
    apiKey: string;
    apiEndpoint: string;
  }>({
    provider: 'OPENROUTER',
    modelName: 'openai/gpt-4-turbo',
    temperature: 0.7,
    maxTokens: 2000,
    apiKey: '',
    apiEndpoint: '',
  });

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [availableModelsData, setAvailableModelsData] = useState<Array<{
    id: string;
    name: string;
    contextLength?: number;
    pricing?: {
      prompt: string;
      completion: string;
    };
  }>>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [selectedModelDetails, setSelectedModelDetails] = useState<any>(null);

  // Load OpenRouter models when provider is selected
  useEffect(() => {
    if (newConfig.provider === 'OPENROUTER' && availableModels.length === 0) {
      loadOpenRouterModels();
    } else if (newConfig.provider !== 'OPENROUTER') {
      setAvailableModels(providerInfo[newConfig.provider].models);
    }
  }, [newConfig.provider]);

  const loadOpenRouterModels = async () => {
    setLoadingModels(true);
    try {
      const response = await fetch('/api/ai/openrouter');
      const data = await response.json();
      if (data.success && data.models) {
        const modelIds = data.models.map((m: any) => m.id);
        setAvailableModels(modelIds);
        setAvailableModelsData(data.models);
      } else {
        setAvailableModels(providerInfo.OPENROUTER.models);
        setAvailableModelsData([]);
      }
    } catch (error) {
      console.error('Error loading OpenRouter models:', error);
      setAvailableModels(providerInfo.OPENROUTER.models);
      setAvailableModelsData([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleAddConfig = () => {
    const config: AIConfig = {
      id: Date.now().toString(),
      provider: newConfig.provider,
      modelName: newConfig.modelName,
      isActive: false,
      isDefault: false,
      temperature: newConfig.temperature,
      maxTokens: newConfig.maxTokens,
      requestCount: 0,
      apiEndpoint: newConfig.apiEndpoint || providerInfo[newConfig.provider].endpoint,
    };
    setConfigs([...configs, config]);
    setShowAddModal(false);
    setNewConfig({ provider: 'OPENAI', modelName: 'gpt-4-turbo', temperature: 0.7, maxTokens: 2000, apiKey: '', apiEndpoint: '' });
  };

  const handleToggleActive = (id: string) => {
    setConfigs(configs.map(c => {
      if (c.id === id) {
        return { ...c, isActive: !c.isActive };
      }
      return c;
    }));
  };

  const handleSetDefault = (id: string) => {
    setConfigs(configs.map(c => ({
      ...c,
      isDefault: c.id === id,
      isActive: c.id === id ? true : c.isActive,
    })));
  };

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบ AI Model นี้หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้')) {
      setConfigs(configs.filter(c => c.id !== id));
    }
  };

  const handleEdit = (config: AIConfig) => {
    setEditingConfig(config);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingConfig) return;
    setConfigs(configs.map(c => c.id === editingConfig.id ? editingConfig : c));
    setShowEditModal(false);
    setEditingConfig(null);
  };

  return (
    <AdminLayout userName="Admin User" userRole="ADMIN">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">ตั้งค่า AI Model</h1>
            <p className="text-slate-600 mt-1">จัดการและตั้งค่า AI Models สำหรับการวิเคราะห์และแนะนำของขวัญ</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-violet-600 hover:bg-violet-700">
            + เพิ่ม AI Model
          </Button>
        </div>

        {/* Info Banner */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">เกี่ยวกับ AI Configuration</h3>
                <p className="text-sm text-blue-800 mb-2">
                  ระบบรองรับการเชื่อมต่อกับ AI Providers หลายราย คุณสามารถ:
                </p>
                <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
                  <li>เพิ่ม AI Model หลายตัวและสลับใช้งานได้</li>
                  <li>ตั้งค่า Model เป็น Default สำหรับการใช้งานทั่วไป</li>
                  <li>ปรับ Temperature และ Max Tokens ตามความต้องการ</li>
                  <li>ติดตามการใช้งานและสถิติของแต่ละ Model</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-slate-900">{configs.length}</div>
              <div className="text-sm text-slate-600">AI Models ทั้งหมด</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-emerald-600">{configs.filter(c => c.isActive).length}</div>
              <div className="text-sm text-slate-600">ใช้งานอยู่</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-violet-600">{configs.filter(c => c.isDefault).length}</div>
              <div className="text-sm text-slate-600">Default Model</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{configs.reduce((sum, c) => sum + c.requestCount, 0)}</div>
              <div className="text-sm text-slate-600">การเรียกใช้ทั้งหมด</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Configs Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {configs.map((config) => {
            const provider = providerInfo[config.provider];
            return (
              <Card key={config.id} className={`${config.isDefault ? 'ring-2 ring-violet-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${provider.color} flex items-center justify-center text-2xl`}>
                        {provider.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>{config.modelName}</CardDescription>
                      </div>
                    </div>
                    {config.isDefault && (
                      <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                        ⭐ Default
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-600">Temperature</div>
                      <div className="font-semibold text-slate-900">{config.temperature}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Max Tokens</div>
                      <div className="font-semibold text-slate-900">{config.maxTokens.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">การเรียกใช้</div>
                      <div className="font-semibold text-slate-900">{config.requestCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">สถานะ</div>
                      <div className={`font-semibold ${config.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {config.isActive ? '✓ ใช้งาน' : '✗ ปิดใช้งาน'}
                      </div>
                    </div>
                  </div>

                  {config.lastUsedAt && (
                    <div className="text-xs text-slate-500 pt-2 border-t">
                      ใช้งานล่าสุด: {config.lastUsedAt}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(config)}
                      className="flex-1 min-w-[80px]"
                    >
                      แก้ไข
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleActive(config.id)}
                      className={`flex-1 min-w-[100px] ${config.isActive ? 'text-amber-600' : 'text-emerald-600'}`}
                    >
                      {config.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
                    </Button>
                    {!config.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(config.id)}
                        className="text-violet-600 min-w-[120px]"
                      >
                        ตั้งเป็น Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(config.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 min-w-[60px]"
                    >
                      🗑️ ลบ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add Config Modal */}
        {showAddModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddModal(false);
              }
            }}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#c4b5fd #f1f5f9',
            }}
          >
            <Card className="w-full max-w-lg my-8 max-h-[90vh] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>เพิ่ม AI Model ใหม่</CardTitle>
                    <CardDescription>ตั้งค่า AI Provider และ Model สำหรับการวิเคราะห์</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto flex-1" style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#c4b5fd #f1f5f9',
                maxHeight: 'calc(90vh - 200px)',
              }}>
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <select
                    value={newConfig.provider}
                    onChange={(e) => {
                      const provider = e.target.value as 'OPENAI' | 'CLAUDE' | 'GEMINI' | 'CUSTOM' | 'OPENROUTER';
                      setNewConfig({ 
                        ...newConfig, 
                        provider,
                        modelName: providerInfo[provider].models[0] || '',
                        apiEndpoint: providerInfo[provider].endpoint,
                      });
                      setModelSearchQuery(''); // Reset search when changing provider
                      setSelectedModelDetails(null); // Clear selected model details
                      if (provider === 'OPENROUTER') {
                        loadOpenRouterModels();
                      }
                    }}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    {Object.entries(providerInfo).map(([key, info]) => (
                      <option key={key} value={key}>{info.icon} {info.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Model Name</Label>
                  {loadingModels ? (
                    <div className="px-4 py-2 border rounded-lg bg-slate-50 text-slate-500">
                      กำลังโหลดโมเดล...
                    </div>
                  ) : newConfig.provider === 'OPENROUTER' ? (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="พิมพ์ค้นหาโมเดล..."
                        value={modelSearchQuery}
                        onChange={(e) => setModelSearchQuery(e.target.value)}
                        className="w-full"
                      />
                      <Input
                        type="text"
                        placeholder="โมเดลที่เลือก"
                        value={newConfig.modelName}
                        onChange={(e) => setNewConfig({ ...newConfig, modelName: e.target.value })}
                        className="w-full bg-slate-50"
                        readOnly
                      />
                      <div 
                        className="border rounded-lg bg-white relative"
                        style={{
                          maxHeight: '300px',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#c4b5fd #f1f5f9',
                          WebkitOverflowScrolling: 'touch',
                        }}
                      >
                        {(availableModels.length > 0 
                          ? availableModels 
                          : providerInfo.OPENROUTER.models
                        )
                          .filter(model => 
                            model.toLowerCase().includes(modelSearchQuery.toLowerCase())
                          )
                          .map(model => {
                            const modelData = availableModelsData.find(m => m.id === model);
                            return (
                              <div
                                key={model}
                                onClick={() => {
                                  setNewConfig({ ...newConfig, modelName: model });
                                  setModelSearchQuery(''); // Clear search after selection
                                  setSelectedModelDetails(modelData || null);
                                }}
                                className={`px-4 py-2 cursor-pointer hover:bg-violet-50 transition-colors ${
                                  newConfig.modelName === model
                                    ? 'bg-violet-100 border-l-4 border-violet-600 font-medium'
                                    : 'border-l-4 border-transparent hover:border-violet-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{model}</span>
                                  {modelData?.contextLength && (
                                    <span className="text-xs text-slate-500">
                                      {Math.round(modelData.contextLength / 1000)}k context
                                    </span>
                                  )}
                                </div>
                                {modelData?.name && modelData.name !== model && (
                                  <div className="text-xs text-slate-600 mt-1">
                                    {modelData.name}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                      {modelSearchQuery && (
                        <p className="text-xs text-slate-500">
                          พบ {(
                            availableModels.length > 0 
                              ? availableModels 
                              : providerInfo.OPENROUTER.models
                          ).filter(m => m.toLowerCase().includes(modelSearchQuery.toLowerCase())).length} โมเดล
                        </p>
                      )}
                      {newConfig.modelName && selectedModelDetails && (
                        <Card className="mt-2 bg-violet-50 border-violet-200">
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-violet-900">โมเดลที่เลือก:</span>
                                <span className="text-xs text-emerald-600">✓</span>
                              </div>
                              <div className="text-sm font-medium text-slate-900">{newConfig.modelName}</div>
                              {selectedModelDetails.name && (
                                <div className="text-xs text-slate-600">ชื่อ: {selectedModelDetails.name}</div>
                              )}
                              {selectedModelDetails.contextLength && (
                                <div className="text-xs text-slate-600">
                                  Context Length: {selectedModelDetails.contextLength.toLocaleString()} tokens
                                </div>
                              )}
                              {selectedModelDetails.pricing && (
                                <div className="text-xs text-slate-600 space-y-1">
                                  <div>ราคา Prompt: {selectedModelDetails.pricing.prompt}</div>
                                  <div>ราคา Completion: {selectedModelDetails.pricing.completion}</div>
                                </div>
                              )}
                              {newConfig.modelName.includes('/') && (
                                <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-violet-200">
                                  <div>Provider: {newConfig.modelName.split('/')[0]}</div>
                                  <div>Model: {newConfig.modelName.split('/').slice(1).join('/')}</div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {newConfig.modelName && !selectedModelDetails && (
                        <p className="text-xs text-emerald-600">
                          ✓ เลือกแล้ว: {newConfig.modelName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <select
                      value={newConfig.modelName}
                      onChange={(e) => setNewConfig({ ...newConfig, modelName: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      {providerInfo[newConfig.provider].models.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Temperature (0-1)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={newConfig.temperature}
                      onChange={(e) => setNewConfig({ ...newConfig, temperature: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={newConfig.maxTokens}
                      onChange={(e) => setNewConfig({ ...newConfig, maxTokens: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Key (จะถูกเข้ารหัส)</Label>
                  <Input
                    type="password"
                    value={newConfig.apiKey}
                    onChange={(e) => setNewConfig({ ...newConfig, apiKey: e.target.value })}
                    placeholder="sk-..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint (ถ้ามี)</Label>
                  <Input
                    value={newConfig.apiEndpoint}
                    onChange={(e) => setNewConfig({ ...newConfig, apiEndpoint: e.target.value })}
                    placeholder={providerInfo[newConfig.provider].endpoint}
                  />
                </div>
              </CardContent>
              <div className="flex gap-3 p-6 pt-0 border-t flex-shrink-0">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  ยกเลิก
                </Button>
                <Button onClick={handleAddConfig} className="flex-1 bg-violet-600 hover:bg-violet-700">
                  เพิ่ม Model
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Config Modal */}
        {showEditModal && editingConfig && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <CardTitle>แก้ไข AI Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Temperature</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingConfig.temperature}
                      onChange={(e) => setEditingConfig({ ...editingConfig, temperature: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Tokens</Label>
                    <Input
                      type="number"
                      value={editingConfig.maxTokens}
                      onChange={(e) => setEditingConfig({ ...editingConfig, maxTokens: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                    ยกเลิก
                  </Button>
                  <Button onClick={handleSaveEdit} className="flex-1 bg-violet-600 hover:bg-violet-700">
                    บันทึก
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

