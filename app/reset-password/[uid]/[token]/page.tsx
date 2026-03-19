"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_APP}/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        token,
        password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Password reset successfully ");
      setTimeout(() => {
        setMessage("Redirecting to login...");
        router.push("/login");
      }, 5000);
    } else {
      setMessage(data.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleReset} className="w-96 space-y-4">
        <h2 className="text-xl font-bold">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="w-full bg-green-600 text-white p-2">
          Reset Password
        </button>

        {message && <p className="text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}