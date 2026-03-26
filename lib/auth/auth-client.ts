"use client";

import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  phoneNumberClient,
  usernameClient,
} from "better-auth/client/plugins";
import type { auth } from "../auth";

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    phoneNumberClient(),
    inferAdditionalFields<typeof auth>(),
  ],
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { signIn, signOut, useSession, signUp, phoneNumber } = authClient;
