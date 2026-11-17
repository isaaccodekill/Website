import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
const OWNER_ID = "35108225";
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub({ authorization: { params: { scope: "read:user" } } })],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/cms/login", error: "/cms/login" },
  callbacks: {
    signIn({ account, profile }) {
      return account?.provider === "github" && String(profile?.id) === OWNER_ID;
    },
    jwt({ token, account, profile }) {
      if (account)
        token.owner =
          account.provider === "github" && String(profile?.id) === OWNER_ID;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.owner === true ? OWNER_ID : "";
      return session;
    },
  },
});
