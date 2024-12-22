"use server";

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { signIn as signInF } from "@/auth";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const validatedFields = SignInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signInF("credentials", {
      email,
      password,
      redirectTo: DEFAULT_SIGN_IN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }

    throw error;
  }
};
