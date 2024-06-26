"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignup: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formObj = new FormData(e.target as unknown as HTMLFormElement);
    const user = Object.fromEntries(formObj.entries());
    console.log(user);
    try {
      const response = await axios.post("/api/users/signup", user);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed", error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-2">
      <form className={"login"} onSubmit={onSignup}>
        <input
          id="username"
          type="text"
          placeholder="Username"
          name={"username"}
          pattern={"[a-zA-Z0-9]+[a-zA-Z0-9 ]+"}
          required
        />
        <input
          id="email"
          required
          type="email"
          placeholder="Email"
          name={"email"}
        />
        <input
          id="password"
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          name={"password"}
          minLength={8}
        />
        <input
          id="confirm-password"
          required
          type="password"
          onChange={(e) => {
            if (e.target.value !== password) {
              e.target.setCustomValidity("Passwords don't match");
            } else {
              e.target.setCustomValidity("");
            }
          }}
          placeholder="Confirm Password"
          minLength={8}
        />
        <button className={"btn main-btn"} type={"submit"} disabled={loading}>
          Sign Up
        </button>
        <Link className={"btn secondary-btn"} href="/login">
          Login
        </Link>
      </form>
    </div>
  );
}
