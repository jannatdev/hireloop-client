import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Bookmark,
  Briefcase,
  Building2,
  CirclePlus,
  CircleUserRound,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react"

/** Roles as stored on the user by better-auth — see `lib/roles.ts`. */
export type DashboardRole = "admin" | "recruiter" | "seeker"

/** Route segment for each role under `app/dashboard/`. Note: seeker -> jobSeeker. */
export const dashboardRoleSegment: Record<DashboardRole, string> = {
  admin: "admin",
  recruiter: "recruiter",
  seeker: "jobSeeker",
}

export const dashboardRoleLabel: Record<DashboardRole, string> = {
  admin: "Administrator",
  recruiter: "Recruiter",
  seeker: "Job Seeker",
}

/** Plan pill shown inside the account card. `null` hides it for that role. */
export const dashboardPlanLabel: Record<DashboardRole, string | null> = {
  admin: null,
  recruiter: "Premium account",
  seeker: null,
}

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** Renders the icon in the brand colour, e.g. the "Add Job" call to action. */
  accent?: boolean
}

/** One flat list per role — the Figma sidebar uses no section headings. */
export const dashboardNav: Record<DashboardRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
    { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
    { label: "Moderation", href: "/dashboard/admin/moderation", icon: ShieldCheck },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],

  recruiter: [
    { label: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboard },
    {
      label: "Add Job",
      href: "/dashboard/recruiter/add-job",
      icon: CirclePlus,
      accent: true,
    },
    { label: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
    {
      label: "Applications",
      href: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    { label: "Settings", href: "/dashboard/recruiter/settings", icon: Settings },
  ],

  seeker: [
    { label: "Dashboard", href: "/dashboard/jobSeeker", icon: LayoutDashboard },
    { label: "Browse Jobs", href: "/dashboard/jobSeeker/browse", icon: Search },
    { label: "Saved Jobs", href: "/dashboard/jobSeeker/saved", icon: Bookmark },
    {
      label: "Applications",
      href: "/dashboard/jobSeeker/applications",
      icon: FileCheck2,
    },
    {
      label: "Profile",
      href: "/dashboard/jobSeeker/profile",
      icon: CircleUserRound,
    },
    { label: "Settings", href: "/dashboard/jobSeeker/settings", icon: Settings },
  ],
}

/**
 * Resolve the dashboard section from the URL so the visible menu always matches
 * the route being rendered. Falls back to `seeker` on anything unrecognised.
 */
export function roleFromPathname(pathname: string): DashboardRole {
  const segment = pathname.split("/")[2]
  const match = (["admin", "recruiter", "seeker"] as const).find(
    (role) => dashboardRoleSegment[role] === segment
  )
  return match ?? "seeker"
}
