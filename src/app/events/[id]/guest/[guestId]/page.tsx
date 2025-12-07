"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/app/component/loading";
import Alert from "~/app/component/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useGuest } from "~/app/utils/actionGuest";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function GuestDetail() {
  const { guestDetail, loading, alert, showAlert, setShowAlert, handleGetGuestDetail } = useGuest();

  const params = useParams();
  const guestId = params.guestId as string;
  const eventId = params.id as string;

  useEffect(() => {
    if (guestId) {
      void handleGetGuestDetail(guestId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guestId]);

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
          title="Guest Detail"
          subtitle={`Detailed information about ${guestDetail?.name ?? "guest"}`}
        />

        {guestDetail ? (
          <>
            <Link
              href={`/events/${eventId}/guest`}
              className="bg-blue-500 hover:bg-blue-600 text-sm p-2 rounded-md border border-white/10 text-white flex items-center m-4 w-20 justify-center"
              style={{ textDecoration: "none" }}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-5 h-5" />
              Back
            </Link>

            {/* Guest Info Card */}
            <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-md rounded-xl p-6 mb-6 shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-5">Guest Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Name</p>
                  <p className="text-lg font-medium text-white">{guestDetail.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone Number</p>
                  <p className="text-lg font-medium text-white">{guestDetail.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">RSVP Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      guestDetail.rsvpStatus === "CONFIRMED"
                        ? "bg-green-500/20 text-green-400"
                        : guestDetail.rsvpStatus === "CANCELLED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {guestDetail.rsvpStatus}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Pax</p>
                  <p className="text-lg font-medium text-white">{guestDetail.pax}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Send Count</p>
                  <p className="text-lg font-medium text-white">
                    {guestDetail.sendCount} / {guestDetail.maxSend}
                  </p>
                </div>

                {guestDetail.substituteName && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Substitute Name</p>
                    <p className="text-lg font-medium text-white">{guestDetail.substituteName}</p>
                  </div>
                )}

                {guestDetail.lastSendAt && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Last Send At</p>
                    <p className="text-lg font-medium text-white">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(guestDetail.lastSendAt))}
                    </p>
                  </div>
                )}

                {guestDetail.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Notes</p>
                    <p className="text-lg font-medium text-white">{guestDetail.notes}</p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-1">Created At</p>
                  <p className="text-lg font-medium text-white">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(guestDetail.createdAt))}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Info Card */}
            {guestDetail.event && (
              <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-md rounded-xl p-6 mb-6 shadow-lg">
                <h2 className="text-2xl font-semibold text-white mb-5">Event Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Event Name</p>
                    <p className="text-lg font-medium text-white">{guestDetail.event.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Venue</p>
                    <p className="text-lg font-medium text-white">{guestDetail.event.venueName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Date</p>
                    <p className="text-lg font-medium text-white">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(guestDetail.event.date))}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Time</p>
                    <p className="text-lg font-medium text-white">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(guestDetail.event.time))}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-400 mb-1">Address</p>
                    <p className="text-lg font-medium text-white">{guestDetail.event.address}</p>
                  </div>

                  {guestDetail.event.googleMapUrl && (
                    <div className="md:col-span-2">
                      <a
                        href={guestDetail.event.googleMapUrl}
                        target="_blank"
                        className="text-blue-400 hover:text-blue-300 underline"
                      >
                        View on Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-800/60 border border-gray-700 backdrop-blur-md rounded-xl p-5 mb-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-3">Guest not found</h2>
          </div>
        )}
      </PageContainer>
    </>
  );
}
