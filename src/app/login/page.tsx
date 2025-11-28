'use client';

import Image from "next/image";
import Link from "next/link";
import { useLogin } from "../utils/actionLogin";
import Loading from "../component/loading";
import Alert from "../component/alert";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
export default function Login() {
  const { handleLogin, loading, alert, showAlert, setShowAlert } = useLogin();
  const fields: Field[] = [
  { type: "text", name: "username", label: "Username", placeholder: "Enter username" },
  { type: "password", name: "password", label: "Password" },
];
  return (
    <div className="relative min-h-screen bg-gradient-to-br flex items-center justify-center px-4">

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}
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
          <h2 className="mt-4 text-3xl font-bold text-white text-center">Welcome Back</h2>
          <p className="mt-1 text-indigo-200 text-sm text-center">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
          {/* <form
  onSubmit={ async (e) =>  {
    e.preventDefault();
    await handleLogin(new FormData(e.currentTarget));
  }}
  className="space-y-5"
>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              className="mt-2 w-full rounded-lg bg-white/20 text-white px-4 py-2 placeholder-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg bg-white/20 text-white px-4 py-2 placeholder-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-lg transition-all shadow-md"
          >
            Sign In
          </button>
        </form> */}

        <FormSetting fields={fields} submitText="Sign In" onSubmit={handleLogin} />

        {/* Register */}
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
