"use client";

import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  return <button onClick={() => router.push("/logout")}>Logout</button>;
};

export default LogoutButton;
