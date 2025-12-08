# OpenRouter API Integration Guide

## การตั้งค่า OpenRouter API

ระบบได้เชื่อมต่อกับ OpenRouter Platform เพื่อให้สามารถใช้งาน AI Models หลากหลายได้

### API Key
API Key ที่ใช้: `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`

### ตั้งค่า Environment Variable

เพิ่มใน `.env.local`:
```env
OPENROUTER_API_KEY=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
```

### Models ที่รองรับ

OpenRouter รองรับ Models หลากหลาย:

**OpenAI:**
- `openai/gpt-4-turbo`
- `openai/gpt-4`
- `openai/gpt-3.5-turbo`

**Anthropic Claude:**
- `anthropic/claude-3-opus`
- `anthropic/claude-3-sonnet`
- `anthropic/claude-3-haiku`

**Google:**
- `google/gemini-pro`
- `google/gemini-ultra`

**Meta:**
- `meta-llama/llama-3-70b-instruct`

**Mistral:**
- `mistralai/mistral-large`

และอื่นๆ อีกมากมาย

### การใช้งาน

1. **ไปที่ Admin Portal > ตั้งค่า AI**
2. **เพิ่ม AI Model ใหม่**
   - เลือก Provider: **OpenRouter**
   - เลือก Model ที่ต้องการ
   - ตั้งค่า Temperature และ Max Tokens
   - ใส่ API Key (ถ้ายังไม่ได้ตั้งใน .env)
3. **ตั้งเป็น Default** (ถ้าต้องการ)

### API Endpoints

- `GET /api/ai/openrouter` - ดึงรายการ Models ที่ใช้ได้
- `POST /api/ai/openrouter` - เรียกใช้ AI
  - Action: `generateQuestions` - สร้างคำถาม
  - Action: `analyzeBehavior` - วิเคราะห์พฤติกรรม
  - Action: `chatCompletion` - Chat completion ทั่วไป

### ตัวอย่างการใช้งาน

```typescript
// สร้างคำถาม
const response = await fetch('/api/ai/openrouter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'generateQuestions',
    framework: 'big5',
    count: 5,
  }),
});

// วิเคราะห์พฤติกรรม
const analysis = await fetch('/api/ai/openrouter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'analyzeBehavior',
    answers: { /* questionnaire answers */ },
    recipientInfo: { /* recipient info */ },
  }),
});
```

### Pricing

OpenRouter ใช้ระบบ Pay-per-use ตาม Model ที่เลือก
- ดูราคาได้ที่: https://openrouter.ai/models
- ตรวจสอบ usage ได้ที่: https://openrouter.ai/activity

### Troubleshooting

**Error: Invalid API Key**
- ตรวจสอบว่า API Key ถูกต้อง
- ตรวจสอบว่าใส่ใน .env.local แล้ว

**Error: Model not found**
- ตรวจสอบว่า Model ID ถูกต้อง
- ลองใช้ Model อื่น

**Error: Rate limit exceeded**
- รอสักครู่แล้วลองใหม่
- ตรวจสอบ quota ที่ OpenRouter dashboard

