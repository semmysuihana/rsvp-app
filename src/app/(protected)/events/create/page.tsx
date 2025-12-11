"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/component/loading";
import Alert from "~/component/alert";
import { useEvent } from "~/app/utils/actionEvent";
import type { Field } from "~/types/field";
import CreateEventTemplate from "~/component/eventCreate";
export default function CreateEvent() {
  const { loading, alert, showAlert, setShowAlert, handleEvent } = useEvent();

  const fields: Field[] = [
    { type: "text", name: "name", label: "Nama Acara", placeholder: "Masukkan nama acara" },
    { type: "text", name: "address", label: "Lokasi", placeholder: "Masukkan lokasi acara" },
    { type: "date", name: "date", label: "Tanggal", placeholder: "Pilih tanggal acara" },
    { type: "time", name: "time", label: "Waktu", placeholder: "Pilih waktu acara" },
    { type: "number", name: "maxPax", label: "Kapasitas", placeholder: "Masukkan kapasitas acara" },
    { type: "text", name: "venueName", label: "Nama Tempat", placeholder: "Masukkan nama tempat acara" },
    { type: "textarea", name: "description", label: "Deskripsi", placeholder: "Masukkan deskripsi acara" },
  ];

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
        {/* Title */}
        <PageHeader title="Create Event" subtitle="Overview & quick stats" />
{/* 
        <Link
          href="/events"
          className="bg-blue-500 hover:bg-blue-600 text-sm p-2 rounded-md border border-white/10 text-white flex items-center m-4 w-20 justify-center"
        >
          <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-5 h-5" />
          Back
        </Link> */}

        {/* CARD WRAPPER  */}
        <CreateEventTemplate fields={fields} handleAction={handleEvent} />
      </PageContainer>
    </>
  );
}
