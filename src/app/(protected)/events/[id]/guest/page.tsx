"use client";

import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useGuest } from "~/app/utils/actionGuest";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import CardList from "~/component/cardList";

export default function Guest() {
  const { guests, eventById, loading, alert, showAlert, setShowAlert, handleGuestById, handleDeleteGuest } = useGuest();

  const params = useParams();
  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      void handleGuestById(eventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return (
    <>
      {/* Loading overlay */}
      {loading && (
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
        <PageHeader
          title="Guests"
          subtitle={`Overview & guest list for ${eventById?.name}`}
        />

        {/* ===== Event Detail Card ===== */}
{eventById && (
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
)}


        {/* ===== Guest List Card ===== */}
        {/* <CardList
          name="guest"
          data={guests}
          link={`/events/${eventId}/guest`}
          onDelete={handleDeleteGuest}
          display={["name", "phone", "rsvpStatus", "pax"]}
        /> */}
      </PageContainer>
    </>
  );
}
