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

export default function DetailsPage() {
  const { eventById, loading, alert, showAlert, setShowAlert, handleEventById } = useEvent();

  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      void handleEventById(eventId);
    }
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
        <PageHeader title="Details Event" subtitle="Overview" />

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
          {eventById.name}
        </h2>

        <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-blue-600/30 border border-blue-500/40 shadow-md backdrop-blur">
          ID: {eventById.id}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6"></div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail label="Venue" value={eventById.venueName} />
        <Detail label="Max Pax" value={eventById.maxPax} />
        <Detail label="Address" value={eventById.address} />
        <Detail label="RT / RW" value={eventById.rtRw} />
        <Detail label="District" value={eventById.district} />
        <Detail label="Sub District" value={eventById.subDistrict} />
        <Detail label="City" value={eventById.city} />
        <Detail label="Google Maps" value={eventById.googleMapUrl} />
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 my-6"></div>

      {/* Date Section */}
      <h3 className="text-xl font-bold text-blue-400">Date & Time</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail label="Date" value={eventById.date.toLocaleDateString()} />
        <Detail label="Time" value={eventById.time.toLocaleTimeString()} />
        <Detail label="Created At" value={eventById.createdAt.toLocaleString()} />
        <Detail label="Updated At" value={eventById.updatedAt.toLocaleString()} />
      </div>

    </div>
  ) : (
    <p className="text-center text-gray-400 text-lg">Event not found</p>
  )}
</div>



      </PageContainer>
    </>
  );
}
function Detail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col bg-white/5 hover:bg-white/10 transition-colors rounded-xl p-4 border border-white/10 shadow-inner">
      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
        {label}
      </span>
      <span className="text-lg font-bold mt-1 tracking-tight">
        {value}
      </span>
    </div>
  );
}

