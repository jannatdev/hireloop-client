"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  BriefcaseIcon,
  Building2Icon,
  ShieldCheckIcon,
} from "lucide-react"
import { cn } from "cn"

import { PasswordInput } from "@/components/auth/password-input"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { type SignUpRole } from "@/lib/roles"

const roleOptions: Array<{
  value: SignUpRole
  label: string
  description: string
  icon: typeof BriefcaseIcon
}> = [
  {
    value: "seeker",
    label: "Job Seeker",
    description: "Find and apply for your next role",
    icon: BriefcaseIcon,
  },
  {
    value: "recruiter",
    label: "Recruiter",
    description: "Post jobs and hire top talent",
    icon: Building2Icon,
  },
  {
    value: "admin",
    label: "Admin",
    description: "Manage the HireLoop workspace",
    icon: ShieldCheckIcon,
  },
]

type FieldErrors = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const emailPattern = /^\S+@\S+\.\S+$/
const minimumPasswordLength = 8

function toErrorMessage(message?: string | null) {
  if (!message || message === "Failed to fetch") {
    return "Unable to reach the server. Please try again."
  }
  return message
}

function SignUpForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<SignUpRole>("seeker")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const nextErrors: FieldErrors = {}

    if (!trimmedName) {
      nextErrors.name = "Enter your full name."
    }

    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address."
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address."
    }

    if (!password) {
      nextErrors.password = "Create a password."
    } else if (password.length < minimumPasswordLength) {
      nextErrors.password = `Password must be at least ${minimumPasswordLength} characters.`
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password."
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match."
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    const { data, error } = await authClient.signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
      role,
    })
    console.log("user",data)
    setPending(false)
    

    if (error) {
      setFormError(toErrorMessage(error.message))
      return
    }

    router.push("/")
    router.refresh()
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
        <FieldLabel htmlFor="sign-up-name">Full name</FieldLabel>
        <Input
          id="sign-up-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(errors.name) || undefined}
          className="h-11 rounded-xl bg-white/4 px-4 dark:bg-white/4 md:text-sm"
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </Field>

      <Field>
        <FieldLabel id="sign-up-role-label">I am joining as</FieldLabel>
        <RadioGroup
          value={role}
          onValueChange={(value) => setRole(value as SignUpRole)}
          aria-labelledby="sign-up-role-label"
          className="gap-2"
        >
          {roleOptions.map(({ value, label, description, icon: Icon }) => (
            <div
              key={value}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 transition-colors has-data-checked:border-indigo-400/50 has-data-checked:bg-indigo-500/10"
            >
              <RadioGroupItem
                id={`sign-up-role-${value}`}
                value={value}
                className="shrink-0"
              />
              <label
                htmlFor={`sign-up-role-${value}`}
                className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5"
              >
                <Icon
                  aria-hidden="true"
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-colors",
                    value === role && "text-indigo-400"
                  )}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-medium text-white">{label}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {description}
                  </span>
                </span>
              </label>
            </div>
          ))}
        </RadioGroup>
      </Field>

      <Field>
        <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
        <Input
          id="sign-up-email"
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
        <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
        <PasswordInput
          id="sign-up-password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={Boolean(errors.password) || undefined}
          className="h-11 rounded-xl bg-white/4 pl-4 dark:bg-white/4 md:text-sm"
        />
        {errors.password && <FieldError>{errors.password}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="sign-up-confirm-password">
          Confirm password
        </FieldLabel>
        <PasswordInput
          id="sign-up-confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          aria-invalid={Boolean(errors.confirmPassword) || undefined}
          className="h-11 rounded-xl bg-white/[0.04] pl-4 dark:bg-white/[0.04] md:text-sm"
        />
        {errors.confirmPassword && (
          <FieldError>{errors.confirmPassword}</FieldError>
        )}
      </Field>

      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-11 w-full rounded-xl text-sm"
      >
        {pending && <Spinner />}
        {pending ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  )
}

export { SignUpForm }
