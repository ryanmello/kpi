import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import db from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "text" },
      },
      async authorize(credentials) {
        // ensure an email and password have been provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // attempt to fetch user from the database
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // if the user does not exist or the user does not have a hashed password
        // the only instance of no hashedpassword is if user used a social login
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        // compare what the form has submitted to the database password
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  // debug: process.env.NODE_ENV == "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
