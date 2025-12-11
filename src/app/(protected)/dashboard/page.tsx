
"use client";

import PageContainer from "~/component/pageContainer";
import CardContainer from "~/component/cardContainer";
import CardDesign from "~/component/cardDesign";
import Link from "next/link";
import useDashboard from "~/app/utils/actionDashboard";

export default function Dashboard() {
  const { 
    events, 
    totalEvents, 
    totalGuests, 
    totalConfirmed, 
    totalWaiting,
    loading 
  } = useDashboard();

  // Calculate pending percentage
  const pendingPercentage = totalGuests > 0 
    ? Math.round((totalWaiting / totalGuests) * 100) 
    : 0;

  // Get recent 5 events
  const recentEvents = events.slice(0, 5);
  // Calculate RSVP progress percentages
  
  return (
    <PageContainer>
      {/* Gradient Welcome Section */}
      <div className="w-full p-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm opacity-90">
            Here is whats happening with your events
          </p>
        </div>

        <Link
          href="/events/create"
          className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
        >
          + New Event
        </Link>
      </div>

      {/* Cards */}
      <CardContainer cols={4}>
        <CardDesign 
          nameCard="Total Events" 
          value={loading ? "..." : totalEvents.toString()} 
        />
        <CardDesign 
          nameCard="Total Guests" 
          value={loading ? "..." : totalGuests.toString()} 
        />
        <CardDesign 
          nameCard="Confirmed RSVPs" 
          value={loading ? "..." : totalConfirmed.toString()} 
        />
        <CardDesign 
          nameCard="Pending RSVPs" 
          value={loading ? "..." : `${pendingPercentage}%`} 
        />
      </CardContainer>

      {/* Recent Events Section */}
<div className="mt-10 bg-white dark:bg-gray-800 rounded-2xl border p-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg font-semibold">Recent Events</h2>
    <Link
      href="/events"
      className="text-indigo-600 hover:underline text-sm"
    >
      View all events
    </Link>
  </div>

  {loading ? (
    <div className="text-center py-10">Loading...</div>
  ) : recentEvents.length === 0 ? (
    <div className="w-full flex flex-col items-center justify-center py-10 text-center">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <span className="text-gray-500 text-2xl">📅</span>
      </div>
      <p className="mt-4 font-medium">No Events Found</p>
      <p className="text-sm text-gray-500">
        You haven&apos;t created any events yet.
      </p>
      <Link
        href="/events/create"
        className="mt-5 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        + Create Event
      </Link>
    </div>
  ) : (
    <>
      {/* Table Header */}
      <div className="grid grid-cols-12 text-sm font-semibold text-gray-500 border-b pb-3 mb-3">
        <div className="col-span-4">Event Name</div>
        <div className="col-span-2">Date & Time</div>
        <div className="col-span-3">Location</div>
        <div className="col-span-1">Capacity</div>
        <div className="col-span-2">RSVP Progress</div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {recentEvents.map((event) => {
          const confirmed = event.capacity?.confirmed ?? 0;
          const max = event.maxPax ?? 0;
          const progress = max > 0 ? Math.round((confirmed / max) * 100) : 0;

          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="grid grid-cols-12 items-center gap-3 p-4 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {/* Event Name */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  📅
                </div>
                <div>
                  <p className="font-medium">{event.name}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div className="col-span-2 text-sm text-gray-600 dark:text-gray-300">
                {new Date(event.date).toLocaleDateString("en-GB")}  
                <br />
                <span className="text-xs text-gray-400">
                  {new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Location */}
              <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                📍 {event.venueName}
              </div>

              {/* Capacity */}
              <div className="col-span-1 text-sm">
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-200">
                  👥 {confirmed} / {max}
                </div>
              </div>

            {/* RSVP Progress */}
<div className="col-span-2">

  <div className="w-full h-2 rounded bg-gray-200 dark:bg-gray-600 flex overflow-hidden">

    {/* Confirmed */}
    <div
      className="bg-green-500 h-full"
      style={{
        width: `${
          ((event.capacity?.confirmed ?? 0) /
            (event.maxPax ??
              ((event.capacity?.confirmed ?? 0) +
                (event.capacity?.waiting ?? 0) +
                (event.capacity?.canceled ?? event.capacity?.canceled ?? 0)))) *
          100
        }%`,
      }}
    ></div>

    {/* Waiting */}
    <div
      className="bg-yellow-500 h-full"
      style={{
        width: `${
          ((event.capacity?.waiting ?? 0) /
            (event.maxPax ??
              ((event.capacity?.confirmed ?? 0) +
                (event.capacity?.waiting ?? 0) +
                (event.capacity?.canceled ?? event.capacity?.canceled ?? 0)))) *
          100
        }%`,
      }}
    ></div>

    {/* Cancelled */}
    <div
      className="bg-red-500 h-full"
      style={{
        width: `${
          ((event.capacity?.canceled ?? event.capacity?.canceled ?? 0) /
            (event.maxPax ??
              ((event.capacity?.confirmed ?? 0) +
                (event.capacity?.waiting ?? 0) +
                (event.capacity?.canceled ?? event.capacity?.canceled ?? 0)))) *
          100
        }%`,
      }}
    ></div>

  </div>

  {/* Status detail */}
  <div className="mt-2 text-xs space-y-1 text-gray-600 dark:text-gray-300">
    <p className="flex items-center gap-1">
      <span className="text-green-500">✔</span>
      Confirmed: {event.capacity?.confirmed ?? 0}
    </p>
    <p className="flex items-center gap-1">
      <span className="text-yellow-500">⏳</span>
      Waiting: {event.capacity?.waiting ?? 0}
    </p>
    <p className="flex items-center gap-1">
      <span className="text-red-500">❌</span>
      Cancelled: {event.capacity?.canceled ?? event.capacity?.canceled ?? 0}
    </p>
  </div>
</div>


            </Link>
          );
        })}
      </div>
    </>
  )}
</div>

    </PageContainer>
  );
}
