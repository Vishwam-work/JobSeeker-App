
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    //  Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            "https://jobseeker-backend-jy1y.onrender.com/api/login/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          const data = await res.json();

          if (res.ok && data.access) {
            //  Return all available user info
            return {
              id: data.user?.id || credentials?.email,
              name: data.user?.full_name || data.user?.name || "User",
              email: data.user?.email || credentials?.email,
              token: data.access,
            };
          } else {
            console.error("Login failed:", data);
            return null;
          }
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

     callbacks: {
    
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.accessToken = user.token || account?.access_token;
        token.email = user.email;
        token.name =
          user.full_name ||
          user.name ||
          profile?.name ||
          token.name ||
          "User";
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        email: token.email,
        name: token.name  || "Guest", 
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };

