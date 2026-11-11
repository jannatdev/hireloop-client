import type { Metadata } from "next"
import Link from "next/link"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up | HireLoop",
  description: "Create a HireLoop account and start applying to curated jobs.",
}

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Join thousands of job seekers landing their next role with HireLoop."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/SignIn"
            className="font-medium text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthShell>
  )
}
