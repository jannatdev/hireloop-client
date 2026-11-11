import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

type AuthShellProps = {
  title: string
  description: string
  footer?: ReactNode
  children: ReactNode
}

function AuthShell({ title, description, footer, children }: AuthShellProps) {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-4.5rem)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      {/* Ambient glow, mirrors the hero treatment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(99,102,241,0.22),transparent_70%)]"
      />

      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        <Card className="gap-5 rounded-2xl border border-white/10 bg-[#131313]/90 px-6 py-7 ring-0 shadow-[0_20px_60px_-30px_rgba(99,102,241,0.45)] backdrop-blur sm:px-8">
          <CardContent className="px-0">{children}</CardContent>
        </Card>

        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        )}
      </div>
    </main>
  )
}

export { AuthShell }
