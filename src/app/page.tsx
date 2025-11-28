import { redirect } from "next/navigation";
import { cookies } from "next/headers";
export default async function Home() {
  const cookieData = await cookies();

  const cookie = cookieData.get("next-auth.session-token");
  
    if (!cookie) {
    redirect("/login");
  }

  redirect("/dashboard");
}
