'use client';

import Image from "next/image";
import Link from "next/link";
import { useRegister } from "../utils/actionRegister";
import Loading from "../component/loading";
import Alert from "../component/alert";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import Turnstile from "react-turnstile";
import { useState, useEffect } from "react";

export default function Register() {
  const { handleRegister, loading, alert, showAlert, setShowAlert, setResetTurnstile } = useRegister();

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  // Pass reset function to useRegister hook
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    setResetTurnstile(() => () => {
      setTurnstileKey(prev => prev + 1);
      setTurnstileToken(null);
      setTurnstileError(null);
    });
  }, [setResetTurnstile]);

  const fields: Field[] = [
    { type: "text", name: "name", label: "Full Name", placeholder: "Enter full name" },
    { type:"text",name:"idCardNumber",label:"ID Card Number", placeholder:"Enter ID Card Number"},
    { type:"date",name:"birthDate",label:"Birth Date"},
    { type:"select",name:"gender",label:"Gender",options:["MALE","FEMALE"]}, 
    { type:"tel",name:"phone",label:"Phone Number",placeholder:"Enter phone number"},
    { type:"email",name:"email",label:"Email",placeholder:"Enter email"},
    { type:"text",name:"username",label:"Username",placeholder:"Enter username"},
    { type:"password",name:"password",label:"Password",placeholder:"Enter password"},
    { type:"password",name:"confirmPassword",label:"Confirm Password",placeholder:"Enter confirm password"},
  ];

  // wrapper submit handler
  const onSubmit = async (formData: FormData) => {
    if (!turnstileToken) {
      setTurnstileError("Please complete the security check.");
      return;
    }

    formData.append("turnstile", turnstileToken);

     handleRegister(formData);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      <div className="relative min-h-screen bg-gradient-to-br flex items-center justify-center px-4 py-12">

        {showAlert && (
          <div className="mb-4">
            <Alert alert={alert} setShowAlert={setShowAlert} />
          </div>
        )}

        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20">

          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <Image src="/vercel.svg" alt="Logo" width={60} height={60} className="rounded-full" />
            <h2 className="mt-4 text-3xl font-bold text-white text-center">Create Account</h2>
            <p className="mt-1 text-indigo-200 text-sm text-center">
              Fill in your details to register
            </p>
          </div>

          {/* Turnstile Error */}
          {turnstileError && (
            <p className="text-red-300 text-center mb-3">{turnstileError}</p>
          )}

          {/* Turnstile */}
          <div className="mb-4 flex justify-center">
            <Turnstile
              key={turnstileKey}
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onVerify={(token) => {
                setTurnstileToken(token);
                setTurnstileError(null);
              }}
              onError={() => {
                setTurnstileError("Turnstile verification failed. Please try again.");
                setTurnstileToken(null);
              }}
              onExpire={() => {
                setTurnstileToken(null);
                setTurnstileError("Turnstile expired. Please verify again.");
              }}
            />
          </div>

          {/* Form main */}
          <FormSetting fields={fields} submitText="Register" onSubmit={onSubmit} />

          <div className="mt-6 text-center text-sm text-gray-200">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-300 font-semibold hover:text-white transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
