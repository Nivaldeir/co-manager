import NextAuth from 'next-auth'
import { authOptions } from '@/src/shared/config/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

