import "@/src/shared/styles/globals.css"
import { TRPCReactProvider } from "@/src/shared/providers/trpc-provider"
import { NextAuthSessionProvider } from "@/src/shared/providers/session-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <NextAuthSessionProvider>
        <TRPCReactProvider>
          <body>
            {children}
          </body>
        </TRPCReactProvider>
      </NextAuthSessionProvider>
    </html>
  )
}