import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface User extends DefaultUser {
    access_token?: string;
  }

  interface Session extends DefaultSession {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultUser {
    access_token?: string;
  }
}