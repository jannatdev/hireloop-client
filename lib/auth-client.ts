import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

import type { auth } from "@/lib/auth"

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  /** Exposes custom user fields (e.g. `role`) on the typed client */
  plugins: [inferAdditionalFields<typeof auth.options>()],
})

/** Reuse the configured client so every hook/action shares one session cache. */
export const { signIn, signUp, signOut, useSession } = authClient
