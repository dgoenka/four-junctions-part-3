import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function Page() {
  if (cookies().get("token")?.value) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
