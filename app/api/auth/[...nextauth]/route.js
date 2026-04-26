import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { db } = await import('@/lib/db');
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [user.email]);
        
        if (rows.length === 0) {
          await db.query(
            'INSERT INTO users (username, email) VALUES (?, ?)',
            [user.name, user.email]
          );
        }
        return true;
      } catch (error) {
        console.error("Error saving user:", error);
        return true;
      }
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/dashboard";
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };