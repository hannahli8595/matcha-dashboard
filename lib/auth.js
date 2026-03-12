import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      session.user.isOwner = session.user.email === process.env.OWNER_EMAIL;
      return session;
    },
  },
  pages: { signIn: "/private" },
};
