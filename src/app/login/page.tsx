'use client';

import Image from "next/image";
import Link from "next/link";
import { useLogin } from "../utils/actionLogin";
import Loading from "../../component/loading";
import Alert from "../../component/alert";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import Turnstile from "react-turnstile";
import { useState, useEffect } from "react";


export default function Login() {
  const { handleLogin, loading, alert, showAlert, setShowAlert, setResetTurnstile } = useLogin();
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const [turnstileKey, setTurnstileKey] = useState(0);

  useEffect(() => {
    setResetTurnstile(() => () => {
      setTurnstileKey(prev => prev + 1);
      setTurnstileToken("");
      setTurnstileError("");
    });
  }, [setResetTurnstile]);

  const fields: Field[] = [
    { type: "text", name: "username", label: "Username", placeholder: "Enter username" },
    { type: "password", name: "password", label: "Password" },
  ];

  const onSubmit = async (formData: FormData) => {
    if (!turnstileToken) {
      setTurnstileError("Please complete the security check.");
      return;
    }
    formData.append("turnstile", turnstileToken);
    await handleLogin(formData);
  };

return (
  <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">

    {loading && (
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
        <Loading />
      </div>
    )}

    {showAlert && (
      <div className="mb-4">
        <Alert alert={alert} setShowAlert={setShowAlert} />
      </div>
    )}

    {/* CARD LOGIN */}
    <div className="
  relative 
  w-[350px] max-w-full
  bg-white dark:bg-gray-800 
  p-6
  rounded-xl 
  shadow-lg 
  border border-gray-200 dark:border-gray-700 
  mx-auto 
  my-4
  flex flex-col gap-3

">

  <div className="flex flex-col items-center">
    <Image
      src="/rsvp.svg"
      alt="Logo"
      width={60}
      height={60}
      className="rounded-full"
    />
    <h2 className="mt-3 text-lg font-bold text-gray-800 dark:text-white text-center">
      Welcome Back
    </h2>
    <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs text-center">
      Login to manage your events
    </p>
  </div>

  {turnstileError && (
    <p className="mb-2 text-center text-red-600 dark:text-red-400 text-xs">
      {turnstileError}
    </p>
  )}

  <div className="flex justify-center">
  <div className="scale-[0.80] origin-top">
    <Turnstile
      key={turnstileKey}
      sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onVerify={(token) => {
        setTurnstileToken(token);
        setTurnstileError("");
      }}
      onError={() => {
        setTurnstileError("Verification failed. Try again.");
        setTurnstileToken("");
      }}
      onExpire={() => {
        setTurnstileToken("");
        setTurnstileError("Expired. Verify again.");
      }}
    />
  </div>
</div>


  <FormSetting fields={fields} submitText="Login" onSubmit={onSubmit} />

  <div className="mt-2 mb-2 text-center text-xs text-gray-600 dark:text-gray-400">
    Dont have an account?
  </div>

  <Link href="/register" className="text-center block">
    <div className="w-full py-1.5 hover:bg-indigo-400 hover:text-white text-indigo-500 dark:text-indigo-400 border border-indigo-500 dark:border-indigo-400 text-center font-semibold rounded-lg transition-all text-sm shadow">
      Create an account
    </div>
  </Link>

</div>


  </div>
);

}
