"use client";

import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/app/component/loading";
import Alert from "~/app/component/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEvent } from "~/app/utils/actionEvent";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";
export default function EditPage() {
  const { eventById, loading, alert, showAlert, setShowAlert, handleEventById, handleUpdate } = useEvent();
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
    ];
  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      void handleEventById(eventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

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
        <PageHeader title="Edit Event" subtitle="Overview" />

        <Link
  href="/events"
  className="inline-flex items-center gap-2 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-lg shadow-blue-900/30 transition-all"
>
  <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-4 h-4" />
  Back
</Link>

<div className="text-white">
  {eventById ? (
    <div className="relative bg-neutral-900/80 backdrop-blur-2xl p-10 rounded-3xl border border-white/10 shadow-2xl space-y-10">

      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-4xl font-extrabold tracking-tight">
          Form Edit ID {eventById.id}
        </h2>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6"></div>

    <FormSetting fields={fields} submitText="Update" onSubmit={(formData) => handleUpdate(eventId, formData)} cols={2} />



    </div>
  ) : (
    <p className="text-center text-gray-400 text-lg">Event not found</p>
  )}
</div>



      </PageContainer>
    </>
  );
}


