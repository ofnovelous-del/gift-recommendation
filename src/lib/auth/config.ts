// src/lib/auth/config.ts
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';
import type { PrismaClient, UserRole } from '@prisma/client';

// ❗ อย่า import prisma แบบปกติอีกแล้ว
// import prisma from '@/lib/db/prisma';

// ---- Lazy Prisma Client (โหลดตอน runtime เท่านั้น) ----
let prisma: PrismaClient | null = null;

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

// ---- Type augmentation ของ next-auth ----
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/th/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const prisma = await getPrisma(); // 👈 ใช้ Prisma ตอนนี้เท่านั้น

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string,
            },
          });

          if (!user || user.status !== 'ACTIVE') {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login (ถ้า error ก็แค่ warn)
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });
          } catch (updateError) {
            console.warn('Failed to update last login:', updateError);
          }

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
          };
        } catch (error: any) {
          console.error('Database error during authentication:', error);

          // Fallback: Allow login with hardcoded credentials if database is not available
          const fallbackUsers = [
            {
              email: 'admin@gift.com',
              password: 'password123',
              user: {
                id: 'fallback-admin',
                email: 'admin@gift.com',
                name: 'Admin User',
                role: 'ADMIN' as UserRole,
              },
            },
            {
              email: 'sales1@gift.com',
              password: 'password123',
              user: {
                id: 'fallback-sales1',
                email: 'sales1@gift.com',
                name: 'Sales User',
                role: 'SALES' as UserRole,
              },
            },
          ];

          const fallbackUser = fallbackUsers.find(
            (u) =>
              u.email === credentials.email &&
              u.password === credentials.password
          );

          if (fallbackUser) {
            console.warn(
              'Using fallback authentication (database not available)'
            );
            return fallbackUser.user;
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
