"use client";

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

  useEffect(() => {
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
        {showAlert && (
          <div className="mb-4">
            <Alert alert={alert} setShowAlert={setShowAlert} />
          </div>
        )}

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12
        bg-gradient-to-br from-gray-100 to-gray-300
        dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">

      

        <div
  className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl
  bg-white/10 dark:bg-black/30 
  backdrop-blur-lg p-8 rounded-3xl shadow-2xl
  border border-white/20 dark:border-white/10
  transition duration-300 ease-in-out">


          <div className="flex flex-col items-center mb-6">
            <Image src="/rsvp.svg" alt="Logo" width={60} height={60} className="rounded-full" />
            <h2 className="mt-4 text-3xl font-bold text-center text-black dark:text-white">Create Account</h2>
            <p className="mt-1 text-sm text-center text-gray-600 dark:text-gray-300">
              Fill in your details to register
            </p>
          </div>

          {turnstileError && (
            <p className="mb-4 text-center text-red-600 dark:text-red-400">
              {turnstileError}
            </p>
          )}

          <div className="mb-4 flex justify-center">
            <div className="flex justify-center items-center h-[70px] w-full">
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
          </div>

          <FormSetting fields={fields} submitText="Register" onSubmit={onSubmit} cols={2} />

          <div className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-white transition">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
