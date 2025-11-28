"use client";
import PageHeader from "~/component/pageHeader";
import PageContainer from "~/component/pageContainer";
import Loading from "~/app/component/loading";
import Alert from "~/app/component/alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleLeft
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useEvent } from "~/app/utils/actionEvent";
import FormSetting from "~/component/formSetting";
import type { Field } from "~/types/field";

export default function CreateEvent() {
    const { loading, alert, showAlert, setShowAlert, handleEvent } = useEvent();
   const fields: Field[] = [
  { type: "text", name: "name", label: "Event Name", placeholder: "Enter event name" },
  { type: "date", name: "date", label: "Date" },
  { type: "time", name: "time", label: "Time" },
  { type: "text", name: "venueName", label: "Venue Name", placeholder: "Enter venue" },
  { type: "text", name: "address", label: "Address", placeholder: "Enter address" },
  { type: "text", name: "rtRw", label: "RT/RW", placeholder: "Enter RT/RW", optional: true },
  { type: "text", name: "district", label: "District", placeholder: "Enter district", optional: true },
  { type: "text", name: "subDistrict", label: "Sub District", placeholder: "Enter sub district", optional: true },
  { type: "text", name: "city", label: "City", placeholder: "Enter city", optional: true },
  { type: "url", name: "googleMapUrl", label: "Google Map URL", placeholder: "Enter Google Map URL", optional: true },
  { type: "number", name: "maxPax", label: "Max Pax", placeholder: "Enter max pax" },
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
        <PageHeader title="Create Event" subtitle="Overview & quick stats" />
             <Link
  href="/events"
  className="bg-blue-500 hover:bg-blue-600 text-sm p-2 rounded-md border border-white/10 text-white flex items-center m-4 w-20 justify-center"
  style={{ textDecoration: "none" }}
>
  <FontAwesomeIcon icon={faArrowAltCircleLeft} className="w-5 h-5" />
  Back
</Link>

    <FormSetting fields={fields} submitText="Create" onSubmit={handleEvent} />

    </PageContainer>
</>    
)
}
