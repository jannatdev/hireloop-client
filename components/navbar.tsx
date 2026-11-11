"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOutIcon, MenuIcon } from "lucide-react"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"
import { signOut, useSession } from "@/lib/auth-client"


function firstName(name?: string | null) {
  const trimmed = name?.trim()
  return trimmed ? trimmed.split(/\s+/)[0] : "there"
}

function Navbar() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const navLinks = [
  { label: "Browse Jobs", href: "/browse-job" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: `/dashboard/${session?.user.role || "jobSeeker"}` },
] as const

const navLinkClassName =
  "text-sm text-neutral-300 transition-colors hover:text-white"


  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-background via-background/80 to-transparent px-3 pt-3 sm:px-5 sm:pt-5 lg:pt-8">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#131313]/90 px-4 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.9),14px_0_28px_-14px_rgba(255,255,255,0.35),-14px_0_28px_-14px_rgba(255,255,255,0.35)] backdrop-blur-md sm:h-16 sm:gap-4 sm:px-6 lg:h-[72px]">
        <Logo className="h-9 sm:h-10" />

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
          <nav
            aria-label="Main"
            className="hidden items-center gap-6 md:flex lg:gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClassName}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Separator
            orientation="vertical"
            className="hidden h-5 bg-white/15 md:block"
          />

          {user ? (
            <span className="hidden text-sm text-neutral-300 md:block">
              Welcome,{" "}
              <span className="font-medium text-white">
                {firstName(user.name)}
              </span>
            </span>
          ) : (
            <Link
              href="/SignIn"
              className={cn(
                navLinkClassName,
                "hidden font-medium text-indigo-400 hover:text-indigo-300 md:block"
              )}
            >
              Sign In
            </Link>
          )}

          {user ? (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="hidden h-9 gap-1.5 rounded-lg px-3 text-sm text-neutral-300 hover:bg-white/5 hover:text-white md:inline-flex"
            >
              <LogOutIcon />
              Sign Out
            </Button>
          ) : (
            <Button
              nativeButton={false}
              className="hidden h-9 rounded-lg px-4 text-sm sm:inline-flex sm:px-5"
              render={<Link href="/SignUp" />}
            >
              Get Started
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              aria-label="Open navigation menu"
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-neutral-200 md:hidden"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="right" className="gap-6 p-4 sm:max-w-xs">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav aria-label="Mobile" className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      navLinkClassName,
                      "rounded-lg px-3 py-2.5 hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Separator className="my-3 bg-white/10" />
                {user ? (
                  <span className="rounded-lg px-3 py-2.5 text-sm text-neutral-300">
                    Welcome,{" "}
                    <span className="font-medium text-white">
                      {firstName(user.name)}
                    </span>
                  </span>
                ) : (
                  <Link
                    href="/SignIn"
                    className={cn(
                      navLinkClassName,
                      "rounded-lg px-3 py-2.5 font-medium text-indigo-400 hover:bg-white/5 hover:text-indigo-300"
                    )}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
              {user ? (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="mt-auto h-12 w-full gap-2 rounded-xl px-6 text-[15px] text-neutral-200 hover:bg-white/5 hover:text-white"
                >
                  <LogOutIcon />
                  Sign Out
                </Button>
              ) : (
                <Button
                  nativeButton={false}
                  className="mt-auto h-12 w-full rounded-xl px-6 text-[15px]"
                  render={<Link href="/SignUp" />}
                >
                  Get Started
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
