import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        code: { label: "Code", type: "text", optional: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        // Modo de desenvolvimento: permite login direto com usuários do seed
        const isDevelopment = process.env.NODE_ENV === 'development';
        const devEmails = ['user@example.com', 'analista@example.com', 'admin@example.com'];
        
        if (isDevelopment && devEmails.includes(credentials.email) && credentials.password === 'dev123') {
          // Buscar usuário no banco Prisma
          const { prisma } = await import('@/src/server/lib/prisma');
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (user) {
            return {
              id: user.id,
              name: user.name || '',
              email: user.email,
              role: user.role,
              token: 'dev-token-' + user.id,
            };
          }
        }

        // Autenticação via API externa (produção)
        // Se não estiver em desenvolvimento e não for usuário do seed, tenta API externa
        const apiBackend = process.env.API_BACKEND;
        
        if (apiBackend) {
          try {
            const response = await fetch(`${apiBackend}/v2/auth/app/session`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                code: credentials.code,
              }),
            });

            const data = await response.json();
            
            const isSuccess = data.ok === true || data.success === true || response.ok;
            if (!isSuccess) {
              throw new Error(data.message || "Erro ao fazer login");
            }

            const userData = data.user || data.data?.user;
            const token = data.token || data.data?.token;

            if (!userData || !token) {
              throw new Error("Dados do usuário ou token não encontrados na resposta");
            }

            return {
              id: userData.id || userData.userId?.toString() || "",
              name: userData.name || "",
              email: userData.email || "",
              status: userData.status,
              docStatus: userData.doc_status || userData.docStatus,
              cnpj: userData.cnpj || null,
              companyName: userData.company_name || userData.companyName || null,
              tradeName: userData.trade_name || userData.tradeName || null,
              partnerName: userData.partner_name || userData.partnerName || null,
              role: userData.role || null,
              token: token,
            };
          } catch (error) {
            console.error("Auth error:", error);

            if (error instanceof Error) {
              throw error;
            }

            throw new Error("Erro desconhecido ao fazer login");
          }
        }

        // Se não houver API_BACKEND configurado e não for usuário do seed, retorna erro
        throw new Error("Credenciais inválidas ou API de autenticação não configurada");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = (user as any).token;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.status = (user as any).status;
        token.docStatus = (user as any).docStatus;
        token.cnpj = (user as any).cnpj;
        token.companyName = (user as any).companyName;
        token.tradeName = (user as any).tradeName;
        token.partnerName = (user as any).partnerName;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.token) {
        session.token = token.token;
      }
      session.user.id = token.id || session.user.id;
      session.user.name = token.name || session.user.name;
      session.user.email = token.email || session.user.email;
      session.user.status = token.status;
      session.user.docStatus = token.docStatus;
      session.user.cnpj = token.cnpj ?? undefined;
      session.user.companyName = token.companyName ?? undefined;
      session.user.tradeName = token.tradeName ?? undefined;
      session.user.partnerName = token.partnerName ?? undefined;
      session.user.role = token.role ?? undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    error: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-change-in-production',
};

