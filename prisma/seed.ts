import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.contentBlock.deleteMany()
  await prisma.aIUsageLog.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.aIConfiguration.deleteMany()
  await prisma.giftRecommendationItem.deleteMany()
  await prisma.giftRecommendation.deleteMany()
  await prisma.gift.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.questionnaireResponse.deleteMany()
  await prisma.question.deleteMany()
  await prisma.questionnaire.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Cleared existing data')

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gift.com',
      passwordHash: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  const marketing1 = await prisma.user.create({
    data: {
      email: 'marketing1@gift.com',
      passwordHash: hashedPassword,
      firstName: 'Suphannee',
      lastName: 'Wongsawat',
      role: 'MARKETING',
      status: 'ACTIVE',
    },
  })

  const marketing2 = await prisma.user.create({
    data: {
      email: 'marketing2@gift.com',
      passwordHash: hashedPassword,
      firstName: 'Nattapong',
      lastName: 'Srisuk',
      role: 'MARKETING',
      status: 'ACTIVE',
    },
  })

  const sales1 = await prisma.user.create({
    data: {
      email: 'sales1@gift.com',
      passwordHash: hashedPassword,
      firstName: 'Pranee',
      lastName: 'Sanitwong',
      role: 'SALES',
      status: 'ACTIVE',
    },
  })

  const sales2 = await prisma.user.create({
    data: {
      email: 'sales2@gift.com',
      passwordHash: hashedPassword,
      firstName: 'Somchai',
      lastName: 'Dejkamol',
      role: 'SALES',
      status: 'ACTIVE',
    },
  })

  const sales3 = await prisma.user.create({
    data: {
      email: 'sales3@gift.com',
      passwordHash: hashedPassword,
      firstName: 'Apinya',
      lastName: 'Charoenphon',
      role: 'SALES',
      status: 'ACTIVE',
    },
  })

  console.log('✅ Created users')

  // Create Gifts (20+ items)
  const giftData = [
    {
      name: 'Apple AirPods Pro (2nd Gen)',
      description: 'หูฟังไร้สายคุณภาพสูง พร้อมระบบตัดเสียงรบกวน Active Noise Cancellation เหมาะสำหรับคนรักเทคโนโลยีและดนตรี',
      category: 'ELECTRONICS',
      subCategory: 'Audio',
      price: 8900,
      brand: 'Apple',
      tags: ['premium', 'tech', 'trending', 'audio'],
      targetAudience: ['male', 'female'],
      ageRange: '18-45',
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      description: 'หูฟังครอบหูระดับพรีเมียม เสียงคุณภาพสูง เหมาะกับมืออาชีพและผู้ชื่นชอบเสียงเพลง',
      category: 'ELECTRONICS',
      subCategory: 'Audio',
      price: 13900,
      brand: 'Sony',
      tags: ['premium', 'professional', 'audio'],
      targetAudience: ['male', 'female'],
      ageRange: '25-55',
    },
    {
      name: 'iPad Air (5th Gen) 64GB',
      description: 'แท็บเล็ตอเนกประสงค์ เหมาะสำหรับทำงาน สร้างสรรค์ และความบันเทิง',
      category: 'ELECTRONICS',
      subCategory: 'Tablets',
      price: 21900,
      brand: 'Apple',
      tags: ['premium', 'creative', 'productivity'],
      targetAudience: ['male', 'female'],
      ageRange: '20-50',
    },
    {
      name: 'Moleskine Classic Notebook Set',
      description: 'สมุดโน้ตคลาสสิกคุณภาพสูง พร้อมปากกา เหมาะสำหรับคนรักการเขียนและจดบันทึก',
      category: 'BOOKS_MEDIA',
      subCategory: 'Stationery',
      price: 1250,
      brand: 'Moleskine',
      tags: ['classic', 'professional', 'writing'],
      targetAudience: ['male', 'female'],
      ageRange: '20-60',
    },
    {
      name: 'Kindle Paperwhite (11th Gen)',
      description: 'เครื่องอ่านหนังสืออิเล็กทรอนิกส์ หน้าจอกันน้ำ แบตเตอรี่อึดทน เหมาะสำหรับนักอ่าน',
      category: 'BOOKS_MEDIA',
      subCategory: 'E-readers',
      price: 4890,
      brand: 'Amazon',
      tags: ['tech', 'reading', 'portable'],
      targetAudience: ['male', 'female'],
      ageRange: '18-65',
    },
    {
      name: 'Lego Architecture Statue of Liberty',
      description: 'ชุด Lego สถาปัตยกรรมชื่อดัง เหมาะสำหรับผู้ใหญ่ที่รักการสร้างสรรค์และสะสม',
      category: 'TOYS_GAMES',
      subCategory: 'Building Sets',
      price: 4500,
      brand: 'Lego',
      tags: ['creative', 'premium', 'collectible', 'architecture'],
      targetAudience: ['male', 'female'],
      ageRange: '18-65',
    },
    {
      name: 'Nintendo Switch OLED',
      description: 'เครื่องเล่นเกมพกพา หน้าจอ OLED สดใส เล่นได้ทั้งบนทีวีและพกพา',
      category: 'TOYS_GAMES',
      subCategory: 'Gaming Console',
      price: 12990,
      brand: 'Nintendo',
      tags: ['gaming', 'entertainment', 'family'],
      targetAudience: ['male', 'female', 'kids'],
      ageRange: '8-45',
    },
    {
      name: 'Muji Aromatherapy Diffuser Set',
      description: 'ชุดเครื่องกระจายกลิ่นหอม พร้อมน้ำมันหอมระเหยธรรมชาติ เพื่อการผ่อนคลายและบรรยากาศที่ดี',
      category: 'HOME_LIVING',
      subCategory: 'Aromatherapy',
      price: 1990,
      brand: 'Muji',
      tags: ['wellness', 'relaxation', 'home', 'minimalist'],
      targetAudience: ['female'],
      ageRange: '20-55',
    },
    {
      name: 'Dyson V12 Detect Slim',
      description: 'เครื่องดูดฝุ่นไร้สาย น้ำหนักเบา มีเทคโนโลยีตรวจจับฝุ่น เหมาะสำหรับบ้านสะอาด',
      category: 'HOME_LIVING',
      subCategory: 'Home Appliances',
      price: 22900,
      brand: 'Dyson',
      tags: ['premium', 'practical', 'home', 'technology'],
      targetAudience: ['male', 'female'],
      ageRange: '25-60',
    },
    {
      name: 'Nespresso Vertuo Next',
      description: 'เครื่องชงกาแฟแคปซูล ชงง่าย คุณภาพระดับคาเฟ่ เหมาะสำหรับคนรักกาแฟ',
      category: 'HOME_LIVING',
      subCategory: 'Coffee Makers',
      price: 5990,
      brand: 'Nespresso',
      tags: ['coffee', 'lifestyle', 'convenient'],
      targetAudience: ['male', 'female'],
      ageRange: '25-60',
    },
    {
      name: 'Premium Coffee Subscription (3 months)',
      description: 'บริการส่งกาแฟพรีเมียมถึงบ้าน 3 เดือน คัดสรรเมล็ดกาแฟคุณภาพดีจากทั่วโลก',
      category: 'FOOD_BEVERAGE',
      subCategory: 'Coffee',
      price: 2800,
      brand: 'Roast',
      tags: ['subscription', 'gourmet', 'experience', 'coffee'],
      targetAudience: ['male', 'female'],
      ageRange: '25-60',
    },
    {
      name: 'Godiva Chocolate Gift Box',
      description: 'กล่องช็อกโกแลตพรีเมียม หลากหลายรสชาติ บรรจุภัณฑ์สวยงาม เหมาะเป็นของขวัญ',
      category: 'FOOD_BEVERAGE',
      subCategory: 'Chocolates',
      price: 1890,
      brand: 'Godiva',
      tags: ['luxury', 'sweet', 'gift'],
      targetAudience: ['female'],
      ageRange: '18-65',
    },
    {
      name: 'Adidas Ultraboost 23',
      description: 'รองเท้าวิ่งสุดนุ่ม พื้นรองรับดี เหมาะสำหรับนักวิ่งและคนรักการออกกำลังกาย',
      category: 'SPORTS_OUTDOOR',
      subCategory: 'Running Shoes',
      price: 5900,
      brand: 'Adidas',
      tags: ['sports', 'fitness', 'comfortable'],
      targetAudience: ['male', 'female'],
      ageRange: '18-50',
    },
    {
      name: 'Fitbit Charge 6',
      description: 'สายรัดข้อมือติดตามสุขภาพ วัดชีพจร ติดตามการนอนหลับ และกิจกรรมออกกำลังกาย',
      category: 'SPORTS_OUTDOOR',
      subCategory: 'Fitness Trackers',
      price: 4990,
      brand: 'Fitbit',
      tags: ['fitness', 'health', 'tech'],
      targetAudience: ['male', 'female'],
      ageRange: '18-60',
    },
    {
      name: 'L\'Occitane Shea Butter Gift Set',
      description: 'เซ็ตผลิตภัณฑ์บำรุงผิวจากชีบัตเตอร์ บำรุงผิวให้นุ่มชุ่มชื้น หอมหวาน',
      category: 'BEAUTY_WELLNESS',
      subCategory: 'Skincare',
      price: 2490,
      brand: 'L\'Occitane',
      tags: ['beauty', 'skincare', 'premium'],
      targetAudience: ['female'],
      ageRange: '20-60',
    },
    {
      name: 'Foreo Luna 3',
      description: 'เครื่องทำความสะอาดใบหน้า ด้วยคลื่นสั่นสะเทือน ทำให้ผิวสะอาดลึก นุ่มเนียน',
      category: 'BEAUTY_WELLNESS',
      subCategory: 'Beauty Devices',
      price: 6900,
      brand: 'Foreo',
      tags: ['beauty', 'technology', 'skincare'],
      targetAudience: ['female'],
      ageRange: '20-50',
    },
    {
      name: 'Uniqlo Cashmere Sweater',
      description: 'เสื้อสเวตเตอร์แคชเมียร์นุ่มสบาย อบอุ่น เหมาะกับทุกโอกาส',
      category: 'FASHION',
      subCategory: 'Clothing',
      price: 1990,
      brand: 'Uniqlo',
      tags: ['fashion', 'comfortable', 'quality'],
      targetAudience: ['male', 'female'],
      ageRange: '18-60',
    },
    {
      name: 'Coach Leather Wallet',
      description: 'กระเป๋าสตางค์หนังแท้ ดีไซน์คลาสสิก ทนทาน เหมาะสำหรับผู้บริหารและมืออาชีพ',
      category: 'FASHION',
      subCategory: 'Accessories',
      price: 4900,
      brand: 'Coach',
      tags: ['luxury', 'professional', 'leather'],
      targetAudience: ['male', 'female'],
      ageRange: '25-60',
    },
    {
      name: 'Pandora Charm Bracelet',
      description: 'สร้อยข้อมือเงินพร้อมจี้ สามารถปรับแต่งได้ เหมาะเป็นของขวัญที่มีความหมาย',
      category: 'JEWELRY_ACCESSORIES',
      subCategory: 'Bracelets',
      price: 3500,
      brand: 'Pandora',
      tags: ['jewelry', 'sentimental', 'customizable'],
      targetAudience: ['female'],
      ageRange: '18-50',
    },
    {
      name: 'Spa Day Package - Premium',
      description: 'บัตรสปาครึ่งวัน รวมนวด อบ ซาวน่า และทรีทเมนท์ใบหน้า เพื่อการผ่อนคลายสุดพิเศษ',
      category: 'EXPERIENCE',
      subCategory: 'Wellness',
      price: 4500,
      brand: 'Oasis Spa',
      tags: ['experience', 'wellness', 'relaxation', 'luxury'],
      targetAudience: ['female'],
      ageRange: '25-65',
    },
  ]

  const gifts = []
  for (const data of giftData) {
    const gift = await prisma.gift.create({
      data: {
        ...data,
        category: data.category as any,
        tags: data.tags as any,
        targetAudience: data.targetAudience as any,
        status: 'AVAILABLE',
      },
    })
    gifts.push(gift)
  }

  console.log(`✅ Created ${gifts.length} gifts`)

  // Create Questionnaires
  const birthdayQuestionnaire = await prisma.questionnaire.create({
    data: {
      title: 'Birthday Gift Personality Assessment',
      description: 'แบบสอบถามสำหรับวิเคราะห์บุคลิกและความชอบเพื่อแนะนำของขวัญวันเกิด',
      category: 'Birthday',
      status: 'ACTIVE',
      isDefault: true,
      aiGenerated: false,
      createdById: admin.id,
      questions: {
        create: [
          {
            questionText: 'คุณชอบใช้เวลาว่างทำอะไรมากที่สุด?',
            questionType: 'SINGLE_CHOICE',
            order: 1,
            required: true,
            config: JSON.stringify({
              options: [
                'อ่านหนังสือ / ดูหนัง / ฟังเพลง',
                'ออกกำลังกาย / กีฬา',
                'ทำงานฝีมือ / งานศิลปะ',
                'เล่นเกม / เทคโนโลยี',
                'ท่องเที่ยว / ธรรมชาติ'
              ]
            }),
            behaviorTags: JSON.stringify({
              'อ่านหนังสือ / ดูหนัง / ฟังเพลง': ['intellectual', 'cultural'],
              'ออกกำลังกาย / กีฬา': ['active', 'health-conscious'],
              'ทำงานฝีมือ / งานศิลปะ': ['creative', 'artistic'],
              'เล่นเกม / เทคโนโลยี': ['tech-savvy', 'modern'],
              'ท่องเที่ยว / ธรรมชาติ': ['adventurous', 'outdoorsy']
            }),
          },
          {
            questionText: 'งบประมาณที่คุณต้องการใช้สำหรับของขวัญ?',
            questionType: 'SINGLE_CHOICE',
            order: 2,
            required: true,
            config: JSON.stringify({
              options: [
                'ต่ำกว่า 2,000 บาท',
                '2,000 - 5,000 บาท',
                '5,000 - 10,000 บาท',
                '10,000 - 20,000 บาท',
                'มากกว่า 20,000 บาท'
              ]
            }),
          },
          {
            questionText: 'คุณคิดว่าผู้รับของขวัญชอบสิ่งที่เป็น...',
            questionType: 'SINGLE_CHOICE',
            order: 3,
            required: true,
            config: JSON.stringify({
              options: [
                'ใช้งานได้จริง (Practical)',
                'หรูหรา ดูดี (Luxury)',
                'มีความหมาย ส่วนตัว (Sentimental)',
                'ประสบการณ์ / ความทรงจำ (Experience)',
                'เทรนด์ล่าสุด (Trendy)'
              ]
            }),
            behaviorTags: JSON.stringify({
              'ใช้งานได้จริง (Practical)': ['practical', 'functional'],
              'หรูหรา ดูดี (Luxury)': ['luxury', 'status-conscious'],
              'มีความหมาย ส่วนตัว (Sentimental)': ['sentimental', 'emotional'],
              'ประสบการณ์ / ความทรงจำ (Experience)': ['experiential', 'memory-maker'],
              'เทรนด์ล่าสุด (Trendy)': ['trendy', 'modern']
            }),
          },
          {
            questionText: 'ระดับความใกล้ชิดของคุณกับผู้รับของขวัญ?',
            questionType: 'RATING_SCALE',
            order: 4,
            required: true,
            config: JSON.stringify({
              min: 1,
              max: 5,
              labels: ['รู้จักเล็กน้อย', 'สนิทมาก']
            }),
          },
          {
            questionText: 'ผู้รับของขวัญชอบสิ่งใหม่ๆ และติดตามเทรนด์หรือไม่?',
            questionType: 'YES_NO',
            order: 5,
            required: true,
            config: JSON.stringify({
              yesLabel: 'ใช่ ชอบติดตามเทรนด์',
              noLabel: 'ไม่ ชอบของคลาสสิก'
            }),
          },
        ],
      },
    },
  })

  console.log('✅ Created questionnaire')

  // Create 10 Sample Customers with varied profiles
  const customersData = [
    {
      firstName: 'สมชาย', lastName: 'ใจดี', email: 'somchai@example.com', phone: '0812345678',
      gender: 'MALE', occupation: 'Software Engineer',
      tags: ['tech-savvy', 'modern', 'practical'], createdById: sales1.id
    },
    {
      firstName: 'นันทนา', lastName: 'สวยงาม', email: 'nantana@example.com', phone: '0823456789',
      gender: 'FEMALE', occupation: 'Marketing Manager',
      tags: ['creative', 'trendy', 'social'], createdById: sales2.id
    },
    {
      firstName: 'ประเสริฐ', lastName: 'มั่งคั่ง', email: 'prasert@example.com', phone: '0834567890',
      gender: 'MALE', occupation: 'Business Owner',
      tags: ['luxury', 'status-conscious', 'experienced'], createdById: sales1.id
    },
    {
      firstName: 'สุดารัตน์', lastName: 'รักสวย', email: 'sudarat@example.com', phone: '0845678901',
      gender: 'FEMALE', occupation: 'Teacher',
      tags: ['intellectual', 'caring', 'traditional'], createdById: sales3.id
    },
    {
      firstName: 'วิชัย', lastName: 'กีฬาดี', email: 'wichai@example.com', phone: '0856789012',
      gender: 'MALE', occupation: 'Personal Trainer',
      tags: ['active', 'health-conscious', 'energetic'], createdById: sales2.id
    },
    {
      firstName: 'พิมพ์ใจ', lastName: 'ศิลป์สวย', email: 'pimjai@example.com', phone: '0867890123',
      gender: 'FEMALE', occupation: 'Graphic Designer',
      tags: ['creative', 'artistic', 'aesthetic'], createdById: sales1.id
    },
    {
      firstName: 'ธนากร', lastName: 'เทคโนโลยี', email: 'tanakorn@example.com', phone: '0878901234',
      gender: 'MALE', occupation: 'IT Consultant',
      tags: ['tech-savvy', 'innovative', 'analytical'], createdById: sales3.id
    },
    {
      firstName: 'อรวรรณ', lastName: 'ธรรมชาติ', email: 'orawan@example.com', phone: '0889012345',
      gender: 'FEMALE', occupation: 'Environmental Scientist',
      tags: ['eco-friendly', 'outdoorsy', 'mindful'], createdById: sales2.id
    },
    {
      firstName: 'กิตติพงษ์', lastName: 'หรูหรา', email: 'kittipong@example.com', phone: '0890123456',
      gender: 'MALE', occupation: 'Investment Banker',
      tags: ['luxury', 'professional', 'sophisticated'], createdById: sales1.id
    },
    {
      firstName: 'ชนิดา', lastName: 'ผ่อนคลาย', email: 'chanida@example.com', phone: '0801234567',
      gender: 'FEMALE', occupation: 'Spa Manager',
      tags: ['wellness', 'relaxation', 'beauty'], createdById: sales3.id
    },
  ]

  const customers = []
  for (const data of customersData) {
    const customer = await prisma.customer.create({
      data: {
        ...data,
        gender: data.gender as any,
        tags: data.tags as any,
        city: 'Bangkok',
        province: 'Bangkok',
      },
    })
    customers.push(customer)
  }

  console.log(`✅ Created ${customers.length} customers`)

  // Create AI Configuration
  await prisma.aIConfiguration.create({
    data: {
      provider: 'OPENAI',
      modelName: 'gpt-4-turbo',
      apiKey: 'your-openai-api-key-here',
      isActive: true,
      isDefault: true,
      temperature: 0.7,
      maxTokens: 2000,
    },
  })

  console.log('✅ Created AI configuration')

  // Create Content Blocks
  await prisma.contentBlock.createMany({
    data: [
      {
        key: 'landing_hero_title',
        type: 'text',
        content: 'ค้นหาของขวัญที่เหมาะสมด้วย AI',
        locale: 'th',
      },
      {
        key: 'landing_hero_title',
        type: 'text',
        content: 'Find the Perfect Gift with AI',
        locale: 'en',
      },
      {
        key: 'landing_hero_subtitle',
        type: 'text',
        content: 'ระบบแนะนำของขวัญอัจฉริยะที่วิเคราะห์พฤติกรรมและความชอบของผู้รับ',
        locale: 'th',
      },
      {
        key: 'landing_hero_subtitle',
        type: 'text',
        content: 'Smart gift recommendation system that analyzes recipient behavior and preferences',
        locale: 'en',
      },
    ],
  })

  console.log('✅ Created content blocks')

  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users: 6 (1 Admin, 2 Marketing, 3 Sales)`)
  console.log(`- Customers: ${customers.length}`)
  console.log(`- Gifts: ${gifts.length}`)
  console.log(`- Questionnaires: 1 (with 5 questions)`)
  console.log(`- AI Configurations: 1`)
  console.log(`- Content Blocks: 4`)
  console.log('\n📧 Test accounts:')
  console.log('Admin: admin@gift.com / password123')
  console.log('Marketing: marketing1@gift.com / password123')
  console.log('Sales: sales1@gift.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
