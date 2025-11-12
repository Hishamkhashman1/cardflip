import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      handle?: string | null;
      role?: UserRole;
    };
  }

  interface User {
    handle: string;
    role: UserRole;
    avatarUrl?: string | null;
  }
}
