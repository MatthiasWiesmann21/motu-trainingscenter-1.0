import { initialProfile } from "@/lib/initial-profile";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
export default async function Home() {
  const profile = await initialProfile();
  const user = await currentUser();

  if (profile && user) {
      return redirect("/dashboard");
    }
}
