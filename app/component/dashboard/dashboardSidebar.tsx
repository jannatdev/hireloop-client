"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { signOut, useSession } from "@/lib/auth-client"
import {
  dashboardNav,
  dashboardPlanLabel,
  dashboardRoleLabel,
  dashboardRoleSegment,
  roleFromPathname,
} from "@/lib/dashboard-nav"
import { cn } from "cn"

/**
 * Height of the floating navbar rendered by the root layout at each breakpoint:
 * base 12+56 = 68, sm 20+64 = 84, lg 32+72 = 104.
 */
const NAVBAR_OFFSET = "pt-[68px] sm:pt-[84px] lg:pt-[104px]"

function displayName(name?: string | null, email?: string | null) {
  const trimmed = name?.trim()
  if (trimmed) return trimmed
  return email?.split("@")[0] ?? "Account"
}

function initials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "?"
  const parts = source.split(/\s+/).filter(Boolean)
  const letters =
    parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : source.slice(0, 2)
  return letters.toUpperCase()
}

function DashboardSidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const role = roleFromPathname(pathname)
  const items = dashboardNav[role]
  const rootHref = `/dashboard/${dashboardRoleSegment[role]}`
  const planLabel = dashboardPlanLabel[role]

  const isActive = (href: string) =>
    pathname === href || (href !== rootHref && pathname.startsWith(`${href}/`))

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <Sidebar collapsible="icon" className={cn(NAVBAR_OFFSET, className)}>
      <SidebarHeader className="gap-3">
        {/* Wordmark when expanded, compact tile when collapsed to icons. */}
        {/* <div className="flex h-8 items-center">
           <Logo className="h-8 w-auto" />
          </div>  */}
            <div className="group-data-[collapsible=icon]:hidden">
        
          <div className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground group-data-[collapsible=icon]:flex">
            H
          </div>
        </div>

        {/* Account card — sits under the logo rather than in a footer. */}
        <div className="group-data-[collapsible=icon]:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
                />
              }
            >
              <Avatar size="lg" className="shrink-0">
                {user?.image ? <AvatarImage src={user.image} alt="" /> : null}
                <AvatarFallback className="bg-primary/25 text-sm font-semibold text-white">
                  {initials(user?.name, user?.email)}
                </AvatarFallback>
              </Avatar>

              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-white">
                  {displayName(user?.name, user?.email)}
                </span>
                <span className="truncate text-xs text-neutral-400">
                  {dashboardRoleLabel[role]}
                </span>
                {planLabel ? (
                  <span className="mt-1 w-fit rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-white">
                    {planLabel}
                  </span>
                ) : null}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="start" className="min-w-56">
              <DropdownMenuLabel className="truncate">
                {user?.email ?? "Not signed in"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href={`${rootHref}/settings`} />}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = isActive(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                      className={cn(
                        "h-10 gap-3 rounded-lg px-3 text-[13px] [&_svg]:size-4.5",
                        active
                          ? "bg-white/10! font-medium text-white!"
                          : item.accent
                            ? "text-primary"
                            : "text-neutral-300"
                      )}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}

export { DashboardSidebar }
