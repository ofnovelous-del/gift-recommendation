# 📖 คู่มือการติดตั้งและตั้งค่าระบบ

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ใน root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/gift_recommendation_db"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI API Keys (เลือกใช้ตามต้องการ)
OPENAI_API_KEY="sk-your-openai-key"
ANTHROPIC_API_KEY="sk-ant-your-anthropic-key"
GOOGLE_AI_API_KEY="your-google-ai-key"

# Application Settings
NEXT_PUBLIC_DEFAULT_LOCALE="th"
```

**วิธีสร้าง NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Setup Database

#### Option A: ใช้ Supabase (แนะนำ - ฟรี)

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. Copy Database URL จาก Settings > Database
4. ใส่ใน DATABASE_URL

#### Option B: ใช้ Neon (ฟรี)

1. ไปที่ [neon.tech](https://neon.tech)
2. สร้างโปรเจคใหม่
3. Copy Connection String
4. ใส่ใน DATABASE_URL

#### Option C: ใช้ PostgreSQL Local

1. ติดตั้ง PostgreSQL
2. สร้าง database:
```sql
CREATE DATABASE gift_recommendation_db;
```
3. ใส่ connection string ใน DATABASE_URL

### 4. Push Database Schema

```bash
npm run db:push
```

คำสั่งนี้จะสร้าง tables ทั้งหมดตาม Prisma schema

### 5. Seed Initial Data

```bash
npm run db:seed
```

คำสั่งนี้จะสร้าง:
- Admin user (admin@gift.com / password123)
- Sales users
- Sample questionnaires
- Sample gifts

### 6. รัน Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: http://localhost:3000

## การตั้งค่า AI Models

### 1. ไปที่ Admin Portal
Login ด้วยบัญชี Admin แล้วไปที่ `/th/admin/ai-config`

### 2. เพิ่ม AI Model
- คลิก "เพิ่ม AI Model"
- เลือก Provider (OpenAI, Claude, Gemini)
- ใส่ API Key
- ตั้งค่า Temperature และ Max Tokens
- บันทึก

### 3. ตั้งเป็น Default
เลือก Model ที่ต้องการแล้วคลิก "ตั้งเป็น Default"

## การสร้างแบบสอบถามด้วย AI

1. ไปที่ `/th/admin/questionnaires`
2. คลิก "สร้างด้วย AI"
3. เลือก Framework ทางจิตวิทยา:
   - Big Five Personality
   - MBTI-Style
   - Value-Based Assessment
   - Lifestyle Mapping
4. คลิก "สร้างคำถาม"
5. ตรวจสอบและแก้ไขคำถาม
6. คลิก "อนุมัติและบันทึก"

## การเพิ่มของขวัญ

1. ไปที่ `/th/admin/gifts`
2. คลิก "เพิ่มของขวัญใหม่"
3. กรอกข้อมูล:
   - ชื่อของขวัญ
   - คำอธิบาย
   - หมวดหมู่
   - ราคา
   - แบรนด์
   - แท็ก (คั่นด้วย comma)
4. บันทึก

## การใช้งานสำหรับพนักงานขาย

1. Login ที่ `/th/login`
2. ไปที่ Dashboard
3. คลิก "เริ่มแบบประเมิน" หรือ "เพิ่มลูกค้าใหม่"
4. กรอกข้อมูลผู้รับของขวัญ
5. ทำแบบสอบถาม
6. ดูผลการวิเคราะห์และคำแนะนำ
7. บันทึกผลลัพธ์

## Troubleshooting

### Database Connection Error
```
Error: Can't reach database server
```
**แก้ไข:**
- ตรวจสอบ DATABASE_URL ว่าถูกต้อง
- ตรวจสอบว่า Database server ทำงานอยู่
- ตรวจสอบ Firewall settings

### Prisma Client Error
```
Error: @prisma/client did not initialize yet
```
**แก้ไข:**
```bash
npx prisma generate
npm run db:push
```

### Authentication Error
```
Error: Invalid credentials
```
**แก้ไข:**
- ตรวจสอบว่า User มีใน database
- รัน `npm run db:seed` อีกครั้ง
- ตรวจสอบ password hash

### AI API Error
```
Error: API key is invalid
```
**แก้ไข:**
- ตรวจสอบ API key ใน .env.local
- ตรวจสอบว่า API key ยังใช้งานได้
- ตรวจสอบ quota/credit

## Production Deployment

### 1. Build Application
```bash
npm run build
```

### 2. Environment Variables
ตั้งค่า environment variables ใน hosting platform:
- Vercel
- Netlify
- Railway
- หรือ platform อื่นๆ

### 3. Database
ใช้ managed PostgreSQL service:
- Supabase
- Neon
- Railway
- หรือ service อื่นๆ

### 4. Deploy
```bash
npm run start
```

## Security Checklist

- [ ] เปลี่ยน default passwords
- [ ] ตั้งค่า NEXTAUTH_SECRET ที่แข็งแรง
- [ ] ใช้ HTTPS ใน production
- [ ] ตั้งค่า CORS properly
- [ ] ตรวจสอบ API keys ไม่ leak
- [ ] ตั้งค่า rate limiting
- [ ] Backup database เป็นประจำ

## Performance Optimization

1. **Database Indexing**: ตรวจสอบ indexes ใน Prisma schema
2. **Image Optimization**: ใช้ Next.js Image component
3. **Caching**: ใช้ React Query caching
4. **Code Splitting**: Next.js ทำอัตโนมัติ
5. **CDN**: ใช้ CDN สำหรับ static assets

## Backup & Recovery

### Backup Database
```bash
pg_dump -h localhost -U username -d gift_recommendation_db > backup.sql
```

### Restore Database
```bash
psql -h localhost -U username -d gift_recommendation_db < backup.sql
```

## Monitoring

แนะนำใช้:
- **Vercel Analytics** - สำหรับ Next.js apps
- **Sentry** - สำหรับ error tracking
- **PostgreSQL Monitoring** - สำหรับ database

---

**หมายเหตุ**: สำหรับคำถามเพิ่มเติม กรุณาติดต่อทีมพัฒนา

