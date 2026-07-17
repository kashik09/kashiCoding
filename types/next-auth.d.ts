import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      twoFactorEnabled?: boolean
      twoFactorVerified?: boolean
      mustResetPassword?: boolean
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: Role
    image?: string | null
    twoFactorEnabled?: boolean
    twoFactorVerified?: boolean
    mustResetPassword?: boolean
  }
}
