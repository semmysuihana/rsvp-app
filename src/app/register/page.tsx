'use client';

import Image from "next/image";
import Link from "next/link";
import { useRegister } from "../utils/actionRegister";
import Loading from "../component/loading";
import Alert from "../component/alert";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
export default function Register() {
  const { handleRegister, loading, alert, showAlert, setShowAlert } = useRegister();
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
  return (
    <>
          {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
    <div className="relative min-h-screen bg-gradient-to-br flex items-center justify-center px-4 py-12">
      {/* Alert */}
      {showAlert && (
        <div className="mb-4">
          <Alert alert={alert} setShowAlert={setShowAlert} />
        </div>
      )}

      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/20">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="mt-4 text-3xl font-bold text-white text-center">Create Account</h2>
          <p className="mt-1 text-indigo-200 text-sm text-center">
            Fill in your details to register
          </p>
        </div>

        <FormSetting fields={fields} submitText="Register" onSubmit={handleRegister} />

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
