export const signUpRoles = ["seeker", "recruiter", "admin"] as const

export type SignUpRole = (typeof signUpRoles)[number]

export function isSignUpRole(value: unknown): value is SignUpRole {
  return (
    typeof value === "string" &&
    (signUpRoles as readonly string[]).includes(value)
  )
}
