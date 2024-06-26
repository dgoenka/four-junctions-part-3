import axios from "axios";
import { redirect } from "next/navigation";

export default function Logout() {
  try {
    axios.get("/api/users/logout").then(() => redirect("/login"));
  } catch (error: any) {
    console.log(error.message);
  }
}
