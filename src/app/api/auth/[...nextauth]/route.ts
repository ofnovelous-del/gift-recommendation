// src/app/api/auth/[...nextauth]/route.ts

export const runtime = 'nodejs';          // ให้รันบน Node.js runtime
export const dynamic = 'force-dynamic';   // บังคับไม่ให้ทำ static optimization

import { GET, POST } from '@/lib/auth/config';

export { GET, POST };
