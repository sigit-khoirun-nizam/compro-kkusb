import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'supersecret123',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Email tidak terdaftar')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

        if (!isPasswordValid) {
          throw new Error('Password salah')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        token.role = 'APPLICANT'
        // Just store google email in token
      } else if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        if (token.id) session.user.id = token.id as string
      }
      return session
    }
  }
}
