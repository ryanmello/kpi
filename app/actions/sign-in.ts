"use server";

import * as z from "zod"
import { SignInSchema } from "@/schemas";

export const signIn = async (values: z.infer<typeof SignInSchema>) => {
  const validatedFields = SignInSchema.safeParse(values);

  if(!validatedFields.success){
    return { error: "Invalid credentials" };
  }

  console.log(values);
};
