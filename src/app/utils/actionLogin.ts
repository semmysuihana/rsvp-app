"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Alert } from "~/types/auth";

export function useLogin() {
  const router = useRouter();
  const [alert, setAlert] = useState<Alert | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: FormData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    const turnstile = formData.get("turnstile");

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof turnstile !== "string"
    ) {
      setShowAlert(true);
      setAlert({ type: "error", message: "Format input tidak valid" });
      return;
    }

    if(!turnstile) {
      setShowAlert(true);
      setAlert({ type: "error", message: "Security check tidak valid. Silakan ulangi Turnstile." });
      return;
    }
    if(username.trim() === "" || password.trim() === "") {
      setShowAlert(true);
      setAlert({ type: "error", message: "Please fill all the fields" });
      return;
    }

    setLoading(true);

    try {
      // ---------------------------------------------------
      // 1️⃣ CEK RATE LIMIT DARI BACKEND NEXTAUTH
      // ---------------------------------------------------
      const rateCheck = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        body: new URLSearchParams({
          username: "",
          password: "",
          turnstile: "",
        }),
        redirect: "manual", 
      });

        if (rateCheck.status === 429) {
          setShowAlert(true);
          setAlert({
            type: "warning",
            message:
              "Terlalu banyak percobaan login. Silakan coba beberapa menit lagi.",
          });
          return;
        }

      // ---------------------------------------------------
      // 2️⃣ LANJUT LOGIN DENGAN signIn()
      // ---------------------------------------------------
      const res = await signIn("credentials", {
        username: username.trim(),
        password: password.trim(),
        turnstile,
        redirect: false,
      });

      if (!res) {
        setShowAlert(true);
        setAlert({ type: "error", message: "Terjadi kesalahan server" });
      } else if (res.error === "CredentialsSignin") {
        setShowAlert(true);
        setAlert({
          type: "error",
          message: "Username atau password salah",
        });
      } else if (!res.error) {
        setAlert({ type: "success", message: "Login berhasil!" });
        setShowAlert(true);
        setTimeout(() => router.push("/dashboard"), 500);
      } else {
        setShowAlert(true);
        setAlert({
          type: "error",
          message: `Login gagal: ${res.error}`,
        });
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
      setAlert({
        type: "error",
        message: "Terjadi kesalahan. Silakan coba lagi",
      });
    } finally {
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
