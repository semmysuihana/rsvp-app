"use client";

import { useSearchParams } from "next/navigation";
import useRsvpGuest from "~/app/utils/actionRsvp";

export default function RsvpClient() {
  const search = useSearchParams();

  const guestId = search.get("guestId");
  const token = search.get("token");

  const { guestData, isLoading, error, alert, handleUpdateStatus, isUpdating } =
    useRsvpGuest(guestId, token);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !guestData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-red-200 dark:border-red-800">
          <h1 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 dark:text-gray-300">
            The invitation link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  const event = guestData.event;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 border border-purple-100 dark:border-purple-900">

        {/* Alert */}
        {alert && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              alert.type === "success"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
            }`}
          >
            {alert.message}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold dark:text-white">You're Invited!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Dear {guestData.name},</p>
        </div>

        {/* Event Card */}
        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-purple-900/30 rounded-xl p-4 mb-6 shadow-inner">
          <h2 className="text-lg font-semibold text-center mb-3 dark:text-white">
            {event.name}
          </h2>

          <div className="flex gap-2 items-start mb-2 text-sm dark:text-gray-200">
            <span>📅</span>
            <p>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex gap-2 items-start mb-2 text-sm dark:text-gray-200">
            <span>⏰</span>
            <p>
              {new Date(event.time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex gap-2 items-start mb-3 text-sm dark:text-gray-200">
            <span>📍</span>
            <p>
              {event.venueName}, {event.address}, {event.city}
            </p>
          </div>

          {event.description && (
            <p className="text-sm italic text-gray-600 dark:text-gray-300">
              {event.description}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="space-y-4">
          <label className="text-sm font-medium dark:text-white">Will you be attending? *</label>

          {/* Current Status */}
          <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">Current Status:</p>
            <p
              className={`font-semibold ${
                guestData.rsvpStatus === "CONFIRMED"
                  ? "text-green-600 dark:text-green-400"
                  : guestData.rsvpStatus === "CANCELLED"
                  ? "text-red-600 dark:text-red-400"
                  : "text-yellow-600 dark:text-yellow-400"
              }`}
            >
              {guestData.rsvpStatus}
            </p>
          </div>

          {/* Accept */}
          <button
            onClick={() => handleUpdateStatus("CONFIRMED")}
            disabled={isUpdating || guestData.rsvpStatus === "CONFIRMED"}
            className={`w-full p-3 rounded-xl border text-left transition disabled:opacity-60 disabled:cursor-not-allowed dark:text-white ${
              guestData.rsvpStatus === "CONFIRMED"
                ? "border-green-500 bg-green-50 dark:bg-green-900/30 dark:border-green-700"
                : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
            }`}
          >
            ✓ Joyfully accepts
          </button>

          {/* Decline */}
          <button
            onClick={() => handleUpdateStatus("CANCELLED")}
            disabled={isUpdating || guestData.rsvpStatus === "CANCELLED"}
            className={`w-full p-3 rounded-xl border text-left transition disabled:opacity-60 disabled:cursor-not-allowed dark:text-white ${
              guestData.rsvpStatus === "CANCELLED"
                ? "border-red-500 bg-red-50 dark:bg-red-900/30 dark:border-red-700"
                : "border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500"
            }`}
          >
            ✗ Regretfully declines
          </button>

          {isUpdating && (
            <div className="text-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          )}
        </div>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
          * Required fields
        </p>
      </div>
    </div>
  );
}
