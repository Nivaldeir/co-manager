import { getServerSession } from "next-auth";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authOptions } from "@/src/shared/config/auth";
import { prisma } from "@/src/server/lib/prisma";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  let session = null;
  let token = null;

  try {
    session = await getServerSession(authOptions);
    token = session?.token || null;
  } catch (error) {
    // Se houver erro ao descriptografar a sessão (ex: NEXTAUTH_SECRET mudou),
    // trata como sessão inválida e continua sem autenticação
    console.warn('Erro ao obter sessão:', error);
    session = null;
    token = null;
  }

  return {
    session,
    token,
    prisma,
    headers: opts.req.headers,
    req: opts.req,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

