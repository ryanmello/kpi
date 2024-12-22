import GitHub from "@auth/core/providers/github";

import { NextAuthConfig } from "next-auth";

export default {
  providers: [GitHub],
} satisfies NextAuthConfig;
