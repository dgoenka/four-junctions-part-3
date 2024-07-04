"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post("/api/users/login", user);
      if (data.success) {
        router.refresh();
        router.replace("/home");
      } else alert("Invalid username or password");
    } catch (error: any) {
      console.log("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2">
      <form className={"login"} onSubmit={onLogin}>
        <input
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
        />
        <button className={"btn main-btn"} type={"submit"} disabled={loading}>
          {loading ? "Please Wait" : "Login"}
        </button>
        <Link className={"btn secondary-btn"} href="/signup">
          <span className={"normal"}>Signup</span>
        </Link>
      </form>
    </div>
  );
}
