import { signIn } from "@/auth";
export const metadata = {
  title: "Private notebook",
  robots: { index: false, follow: false },
};
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const ready = !!(
    process.env.AUTH_GITHUB_ID &&
    process.env.AUTH_GITHUB_SECRET &&
    process.env.AUTH_SECRET
  );
  return (
    <section className="studio-welcome">
      <span className="notebook-star" aria-hidden="true">
        ✳
      </span>
      <p className="eyebrow">Just for you</p>
      <h1>Your private notebook.</h1>
      <p>
        A place to think before you share. Sign in with your GitHub account to
        open your drafts.
      </p>
      {error && (
        <p role="alert">
          Sign-in didn’t complete. This notebook is only open to Isaac’s GitHub
          account.
        </p>
      )}
      {ready ? (
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/cms" });
          }}
        >
          <button className="ink-button">Open with GitHub ↗</button>
        </form>
      ) : (
        <p role="status">
          Sign-in setup is in progress. The notebook stays locked until it is
          ready.
        </p>
      )}
    </section>
  );
}
