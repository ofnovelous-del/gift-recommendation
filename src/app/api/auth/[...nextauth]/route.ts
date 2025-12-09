// src/app/api/auth/[...nextauth]/route.ts

import { GET, POST } from '@/lib/auth/config';

// ให้ route นี้รันแบบ dynamic เสมอ (เหมาะกับ auth)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ใช้ handler จาก NextAuth config จริง
export { GET, POST };
