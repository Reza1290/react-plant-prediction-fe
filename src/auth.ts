import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password" },
        isRegisterPage : {label: "isRegisterPage", type: "number"}
      },
      async authorize(credentials, req) {
        console.log(credentials)
        const res = await fetch(`${process.env.ENDPOINT || "http://localhost:5000"}/${Number(credentials.isRegisterPage) ? "register" : "login"}`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        });
        const user = await res.json();
        console.log(res)
        if (res.ok && user?.access_token) { 
          return { ...user, id: user.id || user.username || "guest" }; 
        }
        return null;
      },
      
    })
  ],
  
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },

  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ user, account, profile }) {
      return true; 
    },

    // async redirect({ baseUrl }) {
    //   return `${baseUrl}/dashboard`;
    // },

    async jwt({ token, user, account }) {
      if (user?.access_token) {
        token.accessToken = user.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});