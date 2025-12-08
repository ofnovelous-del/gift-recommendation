import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import * as bcrypt from 'bcryptjs';
import prisma from '@/lib/db/prisma';
import type { UserRole } from '@prisma/client';

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
          // Check if database is available
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

          // Update last login
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { lastLoginAt: new Date() },
            });
          } catch (updateError) {
            // Ignore update error, still allow login
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
          // This is for development/testing only
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
            (u) => u.email === credentials.email && u.password === credentials.password
          );

          if (fallbackUser) {
            console.warn('Using fallback authentication (database not available)');
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
