import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Fetch } from "@/src/shared/lib/utils/fetch";

const fetch = new Fetch({ requireAuth: false });

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

        try {
          const response = await fetch.post<any>(`/v2/auth/app/session`, {
            email: credentials.email,
            password: credentials.password,
            code: credentials.code,
          });
          console.log(response);
          
          const isSuccess = response.ok === true || response.success === true;
          if (!isSuccess) {
            throw new Error(response.message || "Erro ao fazer login");
          }

          const userData = response.user || response.data?.user;
          const token = response.token || response.data?.token;

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
  secret: process.env.NEXTAUTH_SECRET,
};

