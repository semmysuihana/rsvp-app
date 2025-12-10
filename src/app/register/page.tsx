"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegister } from "../utils/actionRegister";
import Loading from "../../component/loading";
import Alert from "../../component/alert";
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
     <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">

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
    {/* CARD REGISTER */}
        <div
  className="relative w-full max-w-md md:max-w-xl lg:max-w-2xl
  bg-white dark:bg-gray-800 
  backdrop-blur-lg p-8 rounded-xl shadow-2xl
  border border-white/20 dark:border-white/10
  transition duration-300 ease-in-out my-4">


          <div className="flex flex-col items-center mb-6">
            <Image src="/rsvp.svg" alt="Logo" width={60} height={60} className="rounded-full" />
            <h2 className="mt-3 text-lg font-bold text-gray-800 dark:text-white text-center">Create Account</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs text-center">
              Fill in your details to register
            </p>
          </div>

          {turnstileError && (
            <p className="mb-4 text-center text-red-600 dark:text-red-400">
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
          <FormSetting fields={fields} submitText="Register" onSubmit={onSubmit} cols={2} />

          <div className="mt-4 mb-4 text-center text-xs text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
          </div>

          <Link href="/login" className="text-center block">
    <div className="w-full py-1.5 hover:bg-indigo-400 hover:text-white text-indigo-500 dark:text-indigo-400 border border-indigo-500 dark:border-indigo-400 text-center font-semibold rounded-lg transition-all text-sm shadow">
      Sign In
    </div>
  </Link>

        </div>
      </div>
  );
}
