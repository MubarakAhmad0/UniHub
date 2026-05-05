// This file need to stay here for auth to work
import { db } from "@/db";
import { users } from "@/db/schema";
import * as schema from "@/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  apiKey,
  emailOTP,
  phoneNumber,
  username,
} from "better-auth/plugins";
import { sendEmail } from "./auth/send-email";
import { invalidateUserPermissions } from "./auth/permission-cache";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      users,
    },
  }),
  advanced: {
    database: {
      generateId: false,
      useNumberId: true,
    },
  },
  debug: true,
  accountLinking: true,
  emailAndPassword: {
    minPasswordLength: 5,
    enabled: true,
    disableSignUp: false,
    autoSignIn: false,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }) => {
      await sendEmail({
        subject: "Reset Password",
        to: user.email,
        from: "no-reply@gmail.com",
        text: url,
      });
    },
  },
  plugins: [
    username(),
    nextCookies(),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        console.log("Sending OTP to", phoneNumber, code);
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@placeholder.app`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
    admin({
      adminRoles: ["admin"],
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(type);
        switch (type) {
          case "forget-password":
            await sendEmail({
              to: email,
              subject: "Reset Password Request",
              from: "no-reply@gmail.com",
              text: otp,
            });
          case "email-verification":
            await sendEmail({
              to: email,
              subject: "Account Verification",
              from: "no-reply@gmail.com",
              text: otp,
            });
          case "sign-in":
            await sendEmail({
              to: email,
              subject: "Sign In OTP",
              from: "no-reply@gmail.com",
              text: otp,
            });
            break;
          default:
            break;
        }
      },
    }),
    apiKey(),
  ],
  // Google social login temporarily disabled
  socialProviders: {},
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          // Bust permission cache on every sign-in so role changes take effect immediately
          await invalidateUserPermissions(String(session.userId));
        },
      },
    },
  },
  session: {
    modelName: "sessions",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    modelName: "users",
    additionalFields: {
      employeeId: {
        type: "string",
        required: false,
      },
      departmentId: {
        type: "number",
        required: false,
      },
      branchId: {
        type: "number",
        required: false,
      },
      oldId: {
        type: "number",
        required: false,
      },
      role: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        required: false,
        defaultValue: true,
      },
    },
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
});

export type Session = typeof auth.$Infer.Session;
