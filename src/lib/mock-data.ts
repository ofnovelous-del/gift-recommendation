// Mock data for testing without database

export const mockUsers = [
  {
    id: '1',
    email: 'admin@gift.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN' as const,
    status: 'ACTIVE' as const,
  },
  {
    id: '2',
    email: 'sales1@gift.com',
    firstName: 'Pranee',
    lastName: 'Sanitwong',
    role: 'SALES' as const,
    status: 'ACTIVE' as const,
  },
  {
    id: '3',
    email: 'sales2@gift.com',
    firstName: 'Somchai',
    lastName: 'Dejkamol',
    role: 'SALES' as const,
    status: 'ACTIVE' as const,
  },
];

export const mockCustomers = [
  {
    id: '1',
    firstName: 'สมชาย',
    lastName: 'ใจดี',
    email: 'somchai@example.com',
    phone: '0812345678',
    gender: 'MALE' as const,
    occupation: 'Software Engineer',
    tags: ['tech-savvy', 'modern', 'practical'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-01-15'),
    createdBy: {
      firstName: 'Pranee',
      lastName: 'Sanitwong',
    },
    _count: {
      responses: 2,
      recommendations: 2,
    },
  },
  {
    id: '2',
    firstName: 'นันทนา',
    lastName: 'สวยงาม',
    email: 'nantana@example.com',
    phone: '0823456789',
    gender: 'FEMALE' as const,
    occupation: 'Marketing Manager',
    tags: ['creative', 'trendy', 'social'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-01-20'),
    createdBy: {
      firstName: 'Somchai',
      lastName: 'Dejkamol',
    },
    _count: {
      responses: 1,
      recommendations: 1,
    },
  },
  {
    id: '3',
    firstName: 'ประเสริฐ',
    lastName: 'มั่งคั่ง',
    email: 'prasert@example.com',
    phone: '0834567890',
    gender: 'MALE' as const,
    occupation: 'Business Owner',
    tags: ['luxury', 'status-conscious', 'experienced'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-01'),
    createdBy: {
      firstName: 'Pranee',
      lastName: 'Sanitwong',
    },
    _count: {
      responses: 3,
      recommendations: 3,
    },
  },
  {
    id: '4',
    firstName: 'สุดารัตน์',
    lastName: 'รักสวย',
    email: 'sudarat@example.com',
    phone: '0845678901',
    gender: 'FEMALE' as const,
    occupation: 'Teacher',
    tags: ['intellectual', 'caring', 'traditional'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-05'),
    createdBy: {
      firstName: 'Apinya',
      lastName: 'Charoenphon',
    },
    _count: {
      responses: 1,
      recommendations: 1,
    },
  },
  {
    id: '5',
    firstName: 'วิชัย',
    lastName: 'กีฬาดี',
    email: 'wichai@example.com',
    phone: '0856789012',
    gender: 'MALE' as const,
    occupation: 'Personal Trainer',
    tags: ['active', 'health-conscious', 'energetic'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-10'),
    createdBy: {
      firstName: 'Somchai',
      lastName: 'Dejkamol',
    },
    _count: {
      responses: 2,
      recommendations: 2,
    },
  },
  {
    id: '6',
    firstName: 'พิมพ์ใจ',
    lastName: 'ศิลป์สวย',
    email: 'pimjai@example.com',
    phone: '0867890123',
    gender: 'FEMALE' as const,
    occupation: 'Graphic Designer',
    tags: ['creative', 'artistic', 'aesthetic'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-15'),
    createdBy: {
      firstName: 'Pranee',
      lastName: 'Sanitwong',
    },
    _count: {
      responses: 1,
      recommendations: 1,
    },
  },
  {
    id: '7',
    firstName: 'ธนากร',
    lastName: 'เทคโนโลยี',
    email: 'tanakorn@example.com',
    phone: '0878901234',
    gender: 'MALE' as const,
    occupation: 'IT Consultant',
    tags: ['tech-savvy', 'innovative', 'analytical'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-18'),
    createdBy: {
      firstName: 'Apinya',
      lastName: 'Charoenphon',
    },
    _count: {
      responses: 2,
      recommendations: 2,
    },
  },
  {
    id: '8',
    firstName: 'อรวรรณ',
    lastName: 'ธรรมชาติ',
    email: 'orawan@example.com',
    phone: '0889012345',
    gender: 'FEMALE' as const,
    occupation: 'Environmental Scientist',
    tags: ['eco-friendly', 'outdoorsy', 'mindful'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-22'),
    createdBy: {
      firstName: 'Somchai',
      lastName: 'Dejkamol',
    },
    _count: {
      responses: 1,
      recommendations: 1,
    },
  },
  {
    id: '9',
    firstName: 'กิตติพงษ์',
    lastName: 'หรูหรา',
    email: 'kittipong@example.com',
    phone: '0890123456',
    gender: 'MALE' as const,
    occupation: 'Investment Banker',
    tags: ['luxury', 'professional', 'sophisticated'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-25'),
    createdBy: {
      firstName: 'Pranee',
      lastName: 'Sanitwong',
    },
    _count: {
      responses: 3,
      recommendations: 3,
    },
  },
  {
    id: '10',
    firstName: 'ชนิดา',
    lastName: 'ผ่อนคลาย',
    email: 'chanida@example.com',
    phone: '0801234567',
    gender: 'FEMALE' as const,
    occupation: 'Spa Manager',
    tags: ['wellness', 'relaxation', 'beauty'],
    city: 'Bangkok',
    province: 'Bangkok',
    createdAt: new Date('2024-02-28'),
    createdBy: {
      firstName: 'Apinya',
      lastName: 'Charoenphon',
    },
    _count: {
      responses: 2,
      recommendations: 2,
    },
  },
];

export const mockGifts = [
  {
    id: '1',
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'หูฟังไร้สายคุณภาพสูง พร้อมระบบตัดเสียงรบกวน Active Noise Cancellation',
    category: 'ELECTRONICS' as const,
    price: 8900,
    brand: 'Apple',
    status: 'AVAILABLE' as const,
  },
  {
    id: '2',
    name: 'Lego Architecture Set',
    description: 'ชุด Lego สถาปัตยกรรมชื่อดัง เหมาะสำหรับผู้ใหญ่ที่รักการสร้างสรรค์',
    category: 'TOYS_GAMES' as const,
    price: 4500,
    brand: 'Lego',
    status: 'AVAILABLE' as const,
  },
  {
    id: '3',
    name: 'Spa Day Package - Premium',
    description: 'บัตรสปาครึ่งวัน รวมนวด อบ ซาวน่า และทรีทเมนท์ใบหน้า',
    category: 'EXPERIENCE' as const,
    price: 4500,
    brand: 'Oasis Spa',
    status: 'AVAILABLE' as const,
  },
];

export const mockStats = {
  customerCount: mockCustomers.length,
  giftCount: mockGifts.filter(g => g.status === 'AVAILABLE').length,
  questionnaireCount: 1,
};

// Mock authentication
export const mockSession = {
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@gift.com',
    role: 'ADMIN' as const,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

// Helper function to search customers
export function searchCustomers(query: string) {
  if (!query) return mockCustomers;

  const lowerQuery = query.toLowerCase();
  return mockCustomers.filter(customer =>
    customer.firstName.toLowerCase().includes(lowerQuery) ||
    customer.lastName.toLowerCase().includes(lowerQuery) ||
    customer.email?.toLowerCase().includes(lowerQuery) ||
    customer.phone?.includes(query)
  );
}

// Helper function to get recent customers
export function getRecentCustomers(limit = 5) {
  return mockCustomers
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
