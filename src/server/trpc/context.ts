import { getServerSession } from "next-auth";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authOptions } from "@/src/shared/config/auth";

export async function createTRPCContext(opts: FetchCreateContextFnOptions) {
  const session = await getServerSession(authOptions);

  const token = session?.token || null;

  return {
    session,
    token,
    headers: opts.req.headers,
    req: opts.req,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

