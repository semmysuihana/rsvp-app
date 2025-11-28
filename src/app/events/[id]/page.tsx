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
  const fetchData = async () => {
    if (eventId) {
      await handleEventById(eventId).catch((err) => {
        console.error("Failed to fetch event details:", err);
      });
    }
  };

  void fetchData(); 
}, [eventId, handleEventById]);


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
          className="bg-blue-500 hover:bg-blue-600 text-sm p-2 rounded-md border border-white/10 text-white flex items-center m-4 w-20 justify-center"
          style={{ textDecoration: "none" }}
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-5 h-5 mr-1" />
          Back
        </Link>

        <div className="text-white m-4">
          <p>Event ID: {eventId}</p>
        </div>
      </PageContainer>
    </>
  );
}
