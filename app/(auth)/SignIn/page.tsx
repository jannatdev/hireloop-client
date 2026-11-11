import type { Metadata } from "next"
import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In | HireLoop",
  description: "Sign in to HireLoop to continue your job search.",
}

export default function SignInPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to pick up where you left off and keep landing interviews."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/SignUp"
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign up
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthShell>
  )
}
