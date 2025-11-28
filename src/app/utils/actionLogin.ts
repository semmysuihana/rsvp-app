"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface LoginInput {
  username: string;
  password: string;
}

interface Alert {
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export function useLogin() {
  const router = useRouter();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: FormData) => {
    const usernameEntry = formData.get("username");
    const passwordEntry = formData.get("password");

    if (typeof usernameEntry !== "string" || typeof passwordEntry !== "string") {
      setShowAlert(true);
      setAlert({ type: "error", message: "Format input tidak valid" });
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      username: usernameEntry.trim(),
      password: passwordEntry.trim(),
      redirect: false,
    });

    

    if (!res?.error) {
      setAlert({ type: "success", message: "Login berhasil!" });
      router.push("/dashboard");
      setLoading(false);
    } else {
      setShowAlert(true);
      setAlert({ type: "error", message: "Username atau password salah" });
      setLoading(false);
    }
  };

  return {
    handleLogin,
    loading,
    alert,
    showAlert,
    setShowAlert,
  };
}
