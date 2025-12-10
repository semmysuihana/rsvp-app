"use client";

import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEvent } from "~/app/utils/actionEvent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
import { useRef } from "react";
import TableList from "~/component/tableList";
import type { guestItem, eventWithGuestItem } from "~/types/eventType";
import ModalDesign from "~/component/modalDesign";
import { useGuest } from "~/app/utils/actionGuest";
export default function EditPage() {
  
  const [page, setPage] = useState<"edit" | "guest" | "preview">("edit");
  const { eventById, loading, alert, showAlert, setShowAlert, handleEventById, handleUpdate } = useEvent();
  const { guests, eventById: guestById, loading: guestLoading, alert: guestAlert, showAlert: guestShowAlert, setShowAlert: setGuestShowAlert, handleAddGuest, handleGuestById } = useGuest();
       const fields: Field[] = [
      { type: "text", name: "name", label: "Event Name", placeholder: "Enter event name", value: eventById?.name },
      { type: "date", name: "date", label: "Date", value: eventById?.date },
      { type: "time", name: "time", label: "Time", value: eventById?.time },
      { type: "text", name: "venueName", label: "Venue Name", placeholder: "Enter venue", value: eventById?.venueName },
      { type: "text", name: "address", label: "Address", placeholder: "Enter address", value: eventById?.address },
      { type: "text", name: "rtRw", label: "RT/RW", placeholder: "Enter RT/RW", optional: true, value: eventById?.rtRw },
      { type: "text", name: "district", label: "District", placeholder: "Enter district", optional: true, value: eventById?.district },
      { type: "text", name: "subDistrict", label: "Sub District", placeholder: "Enter sub district", optional: true, value: eventById?.subDistrict },
      { type: "text", name: "city", label: "City", placeholder: "Enter city", optional: true, value: eventById?.city },
      { type: "url", name: "googleMapUrl", label: "Google Map URL", placeholder: "Enter Google Map URL", optional: true, value: eventById?.googleMapUrl },
      { type: "number", name: "maxPax", label: "Max Pax", placeholder: "Enter max pax", value: eventById?.maxPax },
      { type: "textarea", name: "description", label: "Description", placeholder: "Enter event description", optional: true, value: eventById?.description },
    ];



    const editRef = useRef<HTMLButtonElement>(null);
const guestRef = useRef<HTMLButtonElement>(null);
const previewRef = useRef<HTMLButtonElement>(null);

const activeRef =
  page === "edit" ? editRef :
  page === "guest" ? guestRef :
  previewRef;

  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      console.log("Fetching event ID:", eventId);
      void handleEventById(eventId);
      void handleGuestById(eventId);
    }
  }, [eventId]);

  return (
    <>
      {(loading || guestLoading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <Loading />
        </div>
      )}

     {showAlert && (
  <div className="mb-4 z-[9999]">
    <Alert alert={alert} setShowAlert={setShowAlert} />
  </div>
)}

{guestShowAlert && (
  <div className="mb-4 z-[9999]">
    <Alert alert={guestAlert} setShowAlert={setGuestShowAlert} />
  </div>
)}

      

      <PageContainer>
  <PageHeader title="Edit Event" subtitle="Manage event details" />

  {/* Steps */}
<div className="w-full flex flex-col mb-8">
  <div className="flex items-center gap-8 text-sm font-medium relative">
    {/* TAB 1 */}
    <button
      ref={editRef}
      onClick={() => setPage("edit")}
      className={`pb-1 transition ${
        page === "edit"
          ? "text-indigo-600"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-800"
      }`}
    >
      1. Edit Info
    </button>

    {/* TAB 2 */}
    <button
      ref={guestRef}
      onClick={() => setPage("guest")}
      className={`pb-1 transition ${
        page === "guest"
          ? "text-indigo-600"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-800"
      }`}
    >
      2. Guest List Detail
    </button>

    {/* TAB 3 */}
    <button
      ref={previewRef}
      onClick={() => setPage("preview")}
      className={`pb-1 transition ${
        page === "preview"
          ? "text-indigo-600"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-800"
      }`}
    >
      3. Preview
    </button>
  </div>

  {/* UNDERLINE */}
  <div className="relative h-[2px] mt-1 bg-transparent">
    <div
      className="absolute bottom-0 h-[2px] bg-indigo-600 transition-all duration-300"
      style={{
        width: activeRef.current?.offsetWidth || 0,
        transform: `translateX(${activeRef.current?.offsetLeft || 0}px)`
      }}
    />
  </div>
</div>


  {/* RSVP Summary */}
  {eventById && (
    <div className="p-5 mb-8 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">RSVP Summary</h3>

      <div className="flex items-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          {eventById.capacity?.confirmed ?? 0} PAX Confirmed
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          {eventById.capacity?.waiting ?? 0} PAX Waiting
        </span>

        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          {eventById.capacity?.canceled ?? 0} PAX Cancelled
        </span>
      </div>
    </div>
  )}

  {/* Back Button */}
  <Link
    href="/events"
    className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg shadow-blue-900/30 transition-all"
  >
    <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-4 h-4" />
    Back
  </Link>

  {/* Main Card */}
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 shadow-xl rounded-2xl p-10">

    {/* Header */}
    {eventById ? (
      <>
        {page === "edit" && (
  <EditInfoPage fields={fields} eventId={eventId} handleUpdate={handleUpdate as (id: string, formData: FormData) => Promise<void>} />
)}

{page === "guest" && (
  <GuestListPage
  eventById={eventById as eventWithGuestItem}
  handleAddGuest={handleAddGuest}
/>

)}

{page === "preview" && (
  <PreviewPage eventById={eventById as eventWithGuestItem} />
)}

      </>
    ) : (
      <p className="text-center text-gray-500 dark:text-gray-400 text-lg">Event not found</p>
    )}
  </div>
</PageContainer>

    </>
  );
}


// --------------------- PAGE COMPONENTS ---------------------

function EditInfoPage({ fields, eventId, handleUpdate }: { fields: Field[]; eventId: string; handleUpdate: (id: string, formData: FormData) => Promise<void> }) {
  return (
    <FormSetting
      fields={fields}
      submitText="Update Event"
      onSubmit={(formData) => handleUpdate(eventId, formData)}
      cols={2}
    />
  );
}

function GuestListPage({ eventById, handleAddGuest }: { eventById: eventWithGuestItem; handleAddGuest: (id:string, formData: FormData) => Promise<boolean> }) {
  const [modalAddGuest, setModalAddGuest] = useState(false);
  const fields: Field[] = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email", optional: true },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Pax", name: "pax", type: "number" },
    { label: "RSVP Status", name: "rsvpStatus", type: "select", options: ["CONFIRMED", "WAITING", "CANCELLED"], value: "WAITING" },
    { label: "Notes", name: "notes", type: "text", optional: true },
    { label: "Substitute", name: "substituteName", type: "text", optional: true },
  ];

  const handleSubmit = async (formData: FormData) => {
    const success = await handleAddGuest(eventById.id, formData);
    if (success) {
      setModalAddGuest(false);
    }
  };

  return (
    <>
    {modalAddGuest && (
      <ModalDesign title="Add Guest" isOpen={modalAddGuest} onClose={() => setModalAddGuest(false)}>
        
        <FormSetting
          fields={fields}
          submitText="Add Guest"
          onSubmit={handleSubmit}
          cols={2}
        />
      </ModalDesign>
)}

    <div className="text-gray-800 dark:text-gray-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold">Guest List Detail</h3>
        <button
          onClick={() => {
            setModalAddGuest(true);
          }}
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Add New Guest
          </button>
        </div>
      {eventById?.guests?.length ? (
       <TableList
                       name="guest"
                       data={eventById as eventWithGuestItem}
                       detailIdTo={eventById.id}
                       link={`/events/${eventById.id}/guest`}
                       onDelete={async (id: string) => {
                  console.log("Guest deleted:", id);
                }}
                       display={["name", "email", "rsvpStatus"]}
                     />
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No guests added yet.
        </p>
      )}
    </div>
    </>
  );
}

function PreviewPage({ eventById }: { eventById: eventWithGuestItem }) {
  return (
    <div className="text-gray-800 dark:text-gray-200">
      <h3 className="text-xl font-bold mb-4">Preview Event</h3>
      <div className="border border-gray-300 dark:border-gray-700"></div>
      <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 space-y-2">
        <p><strong>Event:</strong> {eventById?.name}</p>
        <p>
  <strong>Date:</strong>{" "}
  {eventById?.date instanceof Date
    ? eventById.date.toLocaleDateString()
    : eventById?.date}
</p>

<p>
  <strong>Time:</strong>{" "}
  {eventById?.time instanceof Date
    ? eventById.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : eventById?.time}
</p>

        <p><strong>Venue:</strong> {eventById?.venueName}</p>
        <p><strong>Address:</strong> {eventById?.address}</p>
        <p><strong>Total Guest:</strong> {eventById?.capacity?.confirmed + eventById?.capacity?.waiting + eventById?.capacity?.canceled}</p>
        <p className="pt-3"><strong>Description:</strong></p>
        <p className="whitespace-pre-line">
          {eventById?.description || "No description"}
        </p>
      </div>
    </div>
  );
}
