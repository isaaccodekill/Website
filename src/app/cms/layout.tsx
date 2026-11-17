import Link from "next/link";
import { ToastProvider } from "@/components/ui/Toast";
import { signOut } from "@/auth";
import { isOwner } from "@/lib/studio-auth";
export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };
export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await isOwner();
  return (
    <div className="studio">
      <header className="studio-nav">
        <Link className="signature" href="/cms">
          my notebook <span aria-hidden="true">✳</span>
        </Link>
        <nav aria-label="Notebook navigation">
          {owner && (
            <>
              <Link href="/cms/posts">all pages</Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/cms/login" });
                }}
              >
                <button>sign out</button>
              </form>
            </>
          )}
          <Link href="/">visit site ↗</Link>
        </nav>
      </header>
      <ToastProvider>{children}</ToastProvider>
    </div>
  );
}
