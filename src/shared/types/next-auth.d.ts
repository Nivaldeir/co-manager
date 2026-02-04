import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    status?: string;
    docStatus?: string;
    cnpj?: string | null;
    companyName?: string | null;
    tradeName?: string | null;
    partnerName?: string | null;
    role?: string | null;
  }

  interface Session {
    user: User;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    id?: string;
    name?: string;
    email?: string;
    status?: string;
    docStatus?: string;
    cnpj?: string | null;
    companyName?: string | null;
    tradeName?: string | null;
    partnerName?: string | null;
    role?: string | null;
  }
}

