"use client";

import { useProfile } from "~/app/utils/actionProfile";
import type { UserSubPlan } from "~/types/user";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
export default function SubcriptionPlan() {
  const { profile, handleGetProfile,loading } = useProfile();
const { data: session } = useSession(); 
  useEffect(() => {
  if (session?.user.id) {
    void handleGetProfile();
  }
}, [session?.user.id, handleGetProfile]);

  if (loading)
    return (
      <p className="text-center text-gray-400 dark:text-gray-500">
        Loading subscription plan...
      </p>
    );

  if (!profile)
    return (
        <p className="text-center text-gray-400 dark:text-gray-500 font-semibold">
            loading profile.
        </p>
    );

  const user: UserSubPlan = {
    id: profile.id,
    username: profile.username ?? "",
    name: profile.name ?? "",
    email: profile.email ?? null,
    subscriptionPlan:
      profile.subscriptionPlan === "FREE" ||
      profile.subscriptionPlan === "BASIC" ||
      profile.subscriptionPlan === "PRO"
        ? profile.subscriptionPlan
        : null,
  };

  type Plan = {
    title: "FREE" | "BASIC" | "PRO";
    price: string;
    benefits: string[];
  };

  const plans: Plan[] = [
    { title: "FREE", price: "Rp 0", benefits: ["Basic access", "Limited quota"] },
    {
      title: "BASIC",
      price: "Rp 49.000",
      benefits: ["Unlimited quota", "Priority support", "Access to full features"],
    },
    {
      title: "PRO",
      price: "Rp 129.000",
      benefits: ["Team access", "Dedicated support", "Advanced reporting"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 rounded-2xl shadow-lg border
        bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 space-y-6"
    >
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
        Subscription Plan
      </h2>

      {/* Current Subscription */}
      <div className="text-center">
        {user.subscriptionPlan ? (
          <>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
              You are currently subscribed to
            </p>
            <span
              className={`inline-block px-5 py-2 text-lg font-bold rounded-xl tracking-wide
                border border-gray-400 dark:border-gray-600
                ${
                  user.subscriptionPlan === "PRO"
                    ? "bg-purple-600/30 text-purple-300 border-purple-500"
                    : user.subscriptionPlan === "BASIC"
                    ? "bg-blue-600/30 text-blue-300 border-blue-500"
                    : "bg-gray-600/30 text-gray-500 border-gray-500"
                }`}
            >
              {user.subscriptionPlan} PLAN
            </span>
          </>
        ) : (
          <p className="text-lg text-red-600 font-semibold">
            You do not have an active subscription plan.
          </p>
        )}
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => {
          const isCurrent = user.subscriptionPlan === plan.title;

          return (
            <div
              key={plan.title}
              className={`p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md
                ${
                  isCurrent
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
            >
              <h3 className="text-xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
                {plan.title}
              </h3>

              <p className="text-center text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                {plan.price}
              </p>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {plan.benefits.map((b) => (
                  <li key={b}>• {b}</li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                className={`w-full mt-5 py-2 rounded-xl font-semibold transition-all
                ${
                  isCurrent
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isCurrent ? "Current Plan" : "Choose Plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
