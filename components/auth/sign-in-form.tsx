"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

import { PasswordInput } from "@/components/auth/password-input"
import { GoogleIcon } from "@/components/auth/google-icon"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"

type FieldErrors = {
  email?: string
  password?: string
}

const emailPattern = /^\S+@\S+\.\S+$/

function toErrorMessage(message?: string | null) {
  if (!message || message === "Failed to fetch") {
    return "Unable to reach the server. Please try again."
  }
  return message
}

function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors = {}

    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address."
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Enter your password."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    const { error } = await authClient.signIn.email({
      email: trimmedEmail,
      password,
      rememberMe,
    })
    setPending(false)

    if (error) {
      setFormError(toErrorMessage(error.message))
      return
    }

    router.push("/")
    router.refresh()
  }

  async function handleGoogleSignIn() {
    setFormError(null)
    setPending(true)

    const {data:user, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    })
    console.log(user)
    setPending(false)

    if (error) {
      setFormError(toErrorMessage(error.message))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {formError}
        </p>
      )}

      <Field>
        <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
        <Input
          id="sign-in-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(errors.email) || undefined}
          className="h-11 rounded-xl bg-white/[0.04] px-4 dark:bg-white/[0.04] md:text-sm"
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
        <PasswordInput
          id="sign-in-password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password) || undefined}
          className="h-11 rounded-xl bg-white/[0.04] pl-4 dark:bg-white/[0.04] md:text-sm"
        />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>

      <Field orientation="horizontal" className="gap-2.5">
        <Checkbox
          id="sign-in-remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <FieldLabel
          htmlFor="sign-in-remember"
          className="cursor-pointer text-sm font-normal text-muted-foreground"
        >
          Remember me
        </FieldLabel>
      </Field>

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-11 w-full rounded-xl text-sm"
      >
        {pending && <Spinner />}
        {pending ? "Signing in…" : "Sign In"}
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-white/10" />
        <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          or
        </span>
        <Separator className="flex-1 bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        disabled={pending}
        className="h-11 w-full gap-2 rounded-xl border-white/10 bg-white/[0.04] text-sm hover:bg-white/[0.08] dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
      >
        <GoogleIcon />
        Continue with Google
      </Button>
    </form>
  )
}

export { SignInForm }
