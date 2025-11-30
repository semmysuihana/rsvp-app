'use client';

import Image from "next/image";
import Link from "next/link";
import { useLogin } from "../utils/actionLogin";
import Loading from "../component/loading";
import Alert from "../component/alert";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import Turnstile from "react-turnstile";
import { useState } from "react";

export default function Login() {
  const { handleLogin, loading, alert, showAlert, setShowAlert } = useLogin();

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const fields: Field[] = [
    { type: "text", name: "username", label: "Username", placeholder: "Enter username" },
    { type: "password", name: "password", label: "Password" },
  ];

  // Override onSubmit agar token Turnstile ikut terkirim
  const onSubmit = async (formData: FormData) => {
    if (!turnstileToken) {
      setTurnstileError("Please complete the security check.");
      return;
    }

    formData.append("turnstile", turnstileToken);
    
    await handleLogin(formData);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br flex items-center justify-center px-4">

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      {showAlert && (
        <div className="mb-4">
          <Alert alert={alert} setShowAlert={setShowAlert} />
        </div>
      )}

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20">

        <div className="flex flex-col items-center mb-6">
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="mt-4 text-3xl font-bold text-white text-center">Welcome Back</h2>
          <p className="mt-1 text-indigo-200 text-sm text-center">
            Sign in to continue to your account
          </p>
        </div>
        
                {turnstileError && (
          <div className="mb-4">
            <p className="text-red-200 text-center">{turnstileError}</p>
          </div>
        )}
        {/* Turnstile */}
        <div className="mb-4 flex justify-center">
          <div className="flex justify-center items-center h-[70px] w-full">
            <Turnstile
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onVerify={(token) => setTurnstileToken(token)}
            />
          </div>
        </div>



        {/* Form */}
        <FormSetting fields={fields} submitText="Sign In" onSubmit={onSubmit} />

        <div className="mt-6 text-center text-sm text-gray-200">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-300 font-semibold hover:text-white transition">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}
