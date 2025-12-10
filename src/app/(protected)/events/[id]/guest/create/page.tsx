"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useGuest } from "~/app/utils/actionGuest";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function CreateEvent() {
    const { guests, eventById, loading, alert, showAlert, setShowAlert, handleAddGuest, handleGuestById } = useGuest();

    const params = useParams();
    const eventId = params.id as string;

    useEffect(() => {
      if (eventId) {
        void handleGuestById(eventId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);

   const fields: Field[] = [
  { type: "text", name: "name", label: "Guest Name", placeholder: "Enter guest name" },
  { type: "tel", name: "phone", label: "Phone Number", placeholder: "Enter phone number" },
  { type: "text", name: "note", label: "Note", placeholder: "Enter note", optional: true },
  { type: "text", name: "substituteName", label: "Substitute Name", placeholder: "Enter substitute name", optional: true },
  { type: "number", name: "pax", label: "Pax", placeholder: "Enter pax (default 1)", optional: true },
  { type: "number", name: "maxSend", label: "Max Send", placeholder: "Enter max send (default 3)", optional: true },
];

return(
    <>
     {/* Loading overlay */}
          { loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Loading />
            </div>
          )}
       {/* Alert */}
            {showAlert && (
              <div className="mb-4">
                <Alert alert={alert} setShowAlert={setShowAlert} />
              </div>
            )}
    <PageContainer>
        {/* Title */}
        <PageHeader title="Create Event" subtitle={`Overview & quick stats - ${eventById ? eventById.name : ""}`} />
                {/* ===== Event Detail Card ===== */}
{eventById ? (
  <>
  <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-md rounded-xl p-5 mb-6 shadow-lg">
    <h2 className="text-2xl font-semibold text-white mb-3">
      {eventById.name}
    </h2>

    {/* Event info grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
      <p><span className="font-medium text-gray-400">Venue:</span> {eventById.venueName}</p>
      <p><span className="font-medium text-gray-400">Address:</span> {eventById.address}</p>

      <p>
        <span className="font-medium text-gray-400">Date:</span>{" "}
        {new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(new Date(eventById.date))}
      </p>

      <p>
        <span className="font-medium text-gray-400">Time:</span>{" "}
        {new Intl.DateTimeFormat("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(eventById.time))}
      </p>

      <p><span className="font-medium text-gray-400">Max Pax:</span> {eventById.maxPax}</p>
      <p><span className="font-medium text-gray-400">Guest Count:</span> {guests?.length ?? 0}</p>
    </div>

    {/* Google Maps */}
    {eventById.googleMapUrl && (
      <a
        href={eventById.googleMapUrl}
        target="_blank"
        className="mt-3 inline-block text-sm text-blue-400 hover:text-blue-300 underline"
      >
        View on Google Maps
      </a>
    )}
  </div>

             <Link
  href={`/events/${eventId}/guest`}
  className="bg-blue-500 hover:bg-blue-600 text-sm p-2 rounded-md border border-white/10 text-white flex items-center m-4 w-20 justify-center"
  style={{ textDecoration: "none" }}
>
  <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-5 h-5" />
  Back
</Link>

    <FormSetting fields={fields} submitText="Create" onSubmit={handleAddGuest} cols={2} />
    </>
) : (
  <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-md rounded-xl p-5 mb-6 shadow-lg">
    <h2 className="text-2xl font-semibold text-white mb-3">
      Event not found
    </h2>
  </div>
)}
    </PageContainer>
</>    
)
}
