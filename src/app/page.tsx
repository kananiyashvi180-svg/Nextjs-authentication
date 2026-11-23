import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

// Force dynamic — reads cookies at request time
export const dynamic = "force-dynamic";

// ─── Root Page – redirects based on auth status ───────────────────────────────
export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      redirect("/dashboard");
    }
  }

  redirect("/login");
}
