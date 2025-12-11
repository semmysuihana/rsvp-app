"use client";

import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faCalendarAlt, faUserAlt, faCheckCircle, faClock, faTimesCircle, faLocationDot  } from "@fortawesome/free-solid-svg-icons";
import { useEvent } from "~/app/utils/actionEvent";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import TableList from "~/component/tableList";
import type { eventWithGuestItem } from "~/types/eventType";
export default function DetailsPage() {
  const { eventById, loading, alert, showAlert, setShowAlert, handleEventById } = useEvent();
  const params = useParams();

  const eventId = params.id as string;
  useEffect(() => {
    if (eventId) void handleEventById(eventId);
  }, [eventId, handleEventById]);
  
  const totalPax =
    (eventById?.capacity?.confirmed ?? 0) +
    (eventById?.capacity?.waiting ?? 0) +
    (eventById?.capacity?.canceled ?? 0);


  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Loading />
        </div>
      )}

      {showAlert && (
        <div className="mb-4">
          <Alert alert={alert} setShowAlert={setShowAlert} />
        </div>
      )}

      <PageContainer>
        <PageHeader title="Event Details" subtitle="Overview & statistics" />

        {/* Back Button */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 mb-6 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-md"
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Back
        </Link>

          {/* Event Information Card */}
        {eventById ? (
          <>
<div className="bg-white dark:bg-gray-900 dark:text-gray-100 text-gray-900 shadow-lg 
border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-6 transition-colors">


  {/* Title */}
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Event Name</p>
    <p className="text-lg font-semibold">{eventById.name}</p>
  </div>

  {/* Date & Time */}
  <div className="flex items-center gap-3">
    <span className="text-gray-600 dark:text-gray-300 text-sm">
      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
       Date & Time</span>
    <span className="text-sm font-medium">
      {eventById.date.toLocaleDateString()} at {eventById.time.toLocaleTimeString()}
    </span>
  </div>

  {/* Capacity */}
  <div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
      <FontAwesomeIcon icon={faUserAlt} className="mr-2" />
      Capacity</p>
    <p className="text-green-600 dark:text-green-400 font-bold text-sm">{totalPax} / {eventById.maxPax} PAX</p>

    {/* Progress Bar */}
    <CapacityProgressBar
  confirmed={eventById.capacity.confirmed}
  waiting={eventById.capacity.waiting}
  canceled={eventById.capacity.canceled}
  max={eventById.maxPax}
/>


    {/* Status Counts */}
    <div className="flex gap-6 text-xs font-medium mt-3">
      <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><FontAwesomeIcon icon={faCheckCircle} /> {eventById.capacity.confirmed} Confirmed</span>
      <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400"><FontAwesomeIcon icon={faClock} /> {eventById.capacity.waiting} Waiting</span>
      <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><FontAwesomeIcon icon={faTimesCircle} /> {eventById.capacity.canceled} Cancelled</span>
    </div>
  </div>

  {/* Location */}
  <div>
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300"><FontAwesomeIcon icon={faLocationDot} className="mr-2" /> Location</p>
    <p className="text-base font-semibold">{eventById.address}, {eventById.venueName}</p>
  </div>

  {/* Update PAX manually */}
  <div className="space-y-3">
    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Update PAX Manually</p>
    <input
      type="number"
      placeholder="Enter number of guests"
      className="w-full px-3 py-2 border rounded-lg border-gray-300 dark:border-gray-600 
      bg-gray-50 dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500
      focus:ring-2 focus:ring-blue-500 outline-none transition"
    />

    {/* Status Buttons */}
    <div className="grid grid-cols-3 gap-3">
      <button className="py-2 rounded-lg bg-green-100 dark:bg-green-900 
      text-green-700 dark:text-green-300 font-semibold border border-green-300 dark:border-green-800">
        <FontAwesomeIcon icon={faCheckCircle} /> CONFIRMED
      </button>

      <button className="py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 
      text-yellow-700 dark:text-yellow-300 font-semibold border border-yellow-300 dark:border-yellow-800">
        <FontAwesomeIcon icon={faClock} /> WAITING
      </button>

      <button className="py-2 rounded-lg bg-red-100 dark:bg-red-900 
      text-red-700 dark:text-red-300 font-semibold border border-red-300 dark:border-red-800">
        <FontAwesomeIcon icon={faTimesCircle} /> CANCELLED
      </button>
    </div>
  </div>

</div>
<div className="mt-4 bg-white dark:bg-gray-900 dark:text-gray-100 text-gray-900 shadow-lg 
border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-colors">
              <p className="text-lg font-semibold mb-4">Guest List</p>

              <TableList
                data={eventById as eventWithGuestItem}
                detailIdTo={eventById.id}
                link={`/events/${eventById.id}/guest`}
                display={["name", "email", "rsvpStatus"]}
                
              />
            </div>
</>

        ) : (
          <p className="text-center text-gray-400 text-lg">Event not found</p>
        )}
      </PageContainer>
    </>
  );
}
function CapacityProgressBar({ confirmed, waiting, canceled, max } : { confirmed: number; waiting: number; canceled: number; max: number }) {

  const percentConfirmed = (confirmed / max) * 100;
  const percentWaiting = (waiting / max) * 100;
  const percentCanceled = (canceled / max) * 100;

  return (
    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
      {/* Confirmed */}
      <div
        className="bg-green-500 h-full"
        style={{ width: `${percentConfirmed}%` }}
      />

      {/* Waiting */}
      <div
        className="bg-yellow-500 h-full"
        style={{ width: `${percentWaiting}%` }}
      />

      {/* Canceled */}
      <div
        className="bg-red-500 h-full"
        style={{ width: `${percentCanceled}%` }}
      />
    </div>
  );
}
