"use server";

import * as z from "zod"
import { LoginSchema } from "@/schemas";

export const signIn = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if(!validatedFields.success){
    return { error: "Invalid credentials" };
  }

  console.log(values);
};
