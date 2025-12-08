# 🎁 ระบบแนะนำของขวัญตามพฤติกรรมลูกค้า (Gift Recommendation Web Application)

ระบบแนะนำของขวัญอัจฉริยะที่ใช้ AI วิเคราะห์พฤติกรรม ทัศนคติ และความชอบของลูกค้า เพื่อแนะนำของขวัญที่เหมาะสมและตรงใจมากที่สุด

## ✨ ฟีเจอร์หลัก

### ฝั่งหน้าบ้าน (Front-end / Sales User Portal)
- ✅ **Landing Page** - หน้าแรกที่สวยงามพร้อม Responsive Design
- ✅ **ระบบ Authentication** - Login สำหรับพนักงานขาย
- ✅ **สร้างโปรไฟล์ลูกค้า** - กรอกข้อมูลพื้นฐานของผู้รับของขวัญ
- ✅ **แบบสอบถามเชิงจิตวิทยา** - คำถาม Big Five, Lifestyle, Values
- ✅ **ผลการวิเคราะห์** - แสดง Gift Persona และคำแนะนำของขวัญ
- ✅ **ประวัติการแนะนำ** - ดูประวัติลูกค้าและของขวัญที่เคยแนะนำ

### ฝั่งหลังบ้าน (Back-end / Admin Portal)
- ✅ **จัดการผู้ใช้** - เพิ่ม แก้ไข ลบ และกำหนดสิทธิ์ผู้ใช้
- ✅ **จัดการแบบสอบถาม** - สร้าง แก้ไข และสร้างคำถามด้วย AI
- ✅ **จัดการของขวัญ** - เพิ่ม แก้ไข และจัดการรายการของขวัญ
- ✅ **ตั้งค่า AI Model** - ตั้งค่าและสลับใช้ AI Models หลายตัว
- ✅ **รายงานและ Dashboard** - วิเคราะห์ข้อมูลและสถิติการใช้งาน
- ✅ **จัดการลูกค้า** - ดูและจัดการข้อมูลลูกค้าทั้งหมด

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: NextAuth.js v5
- **AI Integration**: OpenAI, Anthropic Claude, Google Gemini
- **Internationalization**: next-intl
- **State Management**: Zustand, React Query

## 📋 ข้อกำหนดเบื้องต้น

- Node.js 18+ 
- npm หรือ yarn
- PostgreSQL Database (หรือใช้ Supabase/Neon ฟรี)

## 🚀 การติดตั้ง

### 1. Clone repository
```bash
git clone <repository-url>
cd projecth01
```

### 2. ติดตั้ง dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local`:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/gift_recommendation"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI API Keys (เลือกใช้ตามต้องการ)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_AI_API_KEY="..."

# Locale
NEXT_PUBLIC_DEFAULT_LOCALE="th"
```

### 4. Setup Database
```bash
# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 5. รัน Development Server
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

## 📁 โครงสร้างโปรเจค

```
projecth01/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── src/
│   ├── app/
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── login/         # Login page
│   │   │   ├── dashboard/    # Dashboard
│   │   │   ├── assessment/    # Assessment flow
│   │   │   └── admin/         # Admin portal
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── ui/                # UI components
│   │   └── admin/             # Admin components
│   ├── lib/
│   │   ├── db/                # Database client
│   │   ├── auth/              # Authentication
│   │   ├── ai/                # AI integration
│   │   └── validations/       # Form validations
│   └── types/                 # TypeScript types
├── messages/                  # i18n translations
└── public/                    # Static files
```

## 🎯 การใช้งาน

### สำหรับพนักงานขาย (Sales)
1. Login เข้าระบบที่ `/th/login`
2. ไปที่ Dashboard เพื่อดูภาพรวม
3. เพิ่มลูกค้าใหม่หรือเริ่มแบบประเมิน
4. ทำแบบสอบถามกับลูกค้า
5. ดูผลการวิเคราะห์และคำแนะนำของขวัญ
6. บันทึกผลลัพธ์ในระบบ

### สำหรับ Admin
1. Login ด้วยบัญชี Admin
2. ไปที่ Admin Portal (`/th/admin/*`)
3. จัดการผู้ใช้ แบบสอบถาม ของขวัญ
4. ตั้งค่า AI Models
5. ดูรายงานและสถิติ

## 🧪 Test Accounts

```
Admin:
Email: admin@gift.com
Password: password123

Sales:
Email: sales1@gift.com
Password: password123
```

## 📊 Database Schema

ระบบใช้ Prisma ORM กับ PostgreSQL โดยมี Models หลักดังนี้:

- **User** - ผู้ใช้งานระบบ (Admin, Marketing, Sales)
- **Customer** - ข้อมูลลูกค้า
- **Questionnaire** - แบบสอบถาม
- **Question** - คำถามในแบบสอบถาม
- **QuestionnaireResponse** - การตอบแบบสอบถาม
- **Answer** - คำตอบแต่ละข้อ
- **Gift** - รายการของขวัญ
- **GiftRecommendation** - คำแนะนำของขวัญ
- **AIConfiguration** - ตั้งค่า AI Models
- **ActivityLog** - บันทึกกิจกรรม
- **AIUsageLog** - บันทึกการใช้งาน AI

## 🤖 AI Integration

ระบบรองรับการเชื่อมต่อกับ AI Providers หลายราย:

- **OpenAI** (GPT-4, GPT-3.5)
- **Anthropic Claude** (Claude 3 Opus, Sonnet, Haiku)
- **Google Gemini** (Gemini Pro, Ultra)

สามารถตั้งค่าและสลับใช้ Model ได้จาก Admin Portal

## 🎨 Design System

- **Colors**: ใช้ Tailwind CSS custom colors
- **Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Typography**: Inter font

## 📱 Responsive Design

ระบบรองรับการแสดงผลบน:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔒 Security

- Password hashing ด้วย bcryptjs
- Session management ด้วย NextAuth.js
- Role-based access control (RBAC)
- API route protection
- Input validation และ sanitization

## 📝 Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build       # Build for production
npm run start       # Start production server

# Database
npm run db:push     # Push schema to database
npm run db:studio   # Open Prisma Studio
npm run db:seed     # Seed database

# Linting
npm run lint        # Run ESLint
```

## 🌐 Internationalization

ระบบรองรับหลายภาษา:
- ไทย (th) - Default
- English (en)

เพิ่มภาษาใหม่ได้ที่ `messages/` directory

## 📈 Performance

- Server-side rendering (SSR)
- Static generation สำหรับหน้า Landing
- Image optimization
- Code splitting
- Lazy loading

## 🐛 Troubleshooting

### Database connection error
- ตรวจสอบ DATABASE_URL ใน .env.local
- ตรวจสอบว่า PostgreSQL ทำงานอยู่
- รัน `npm run db:push` อีกครั้ง

### Authentication ไม่ทำงาน
- ตรวจสอบ NEXTAUTH_SECRET และ NEXTAUTH_URL
- ตรวจสอบว่า User มีใน database
- ตรวจสอบ password hash

### AI API ไม่ทำงาน
- ตรวจสอบ API keys ใน .env.local
- ตรวจสอบว่า API key ถูกต้องและมี quota
- ดู logs ใน Admin Portal

## 📚 เอกสารเพิ่มเติม

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 👥 Contributors

- Development Team

## 📄 License

MIT License

## 🆘 Support

หากมีปัญหาหรือคำถาม กรุณาติดต่อทีมพัฒนา

---

**หมายเหตุ**: ระบบนี้ยังอยู่ในโหมดพัฒนา สำหรับการใช้งานจริงควรทำการทดสอบและปรับแต่งเพิ่มเติม
