"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeCircleCheck, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { guestItem, eventWithGuestItem } from "~/types/eventType";

const columnLabels: Record<string, string> = {
  name: "Guest",
  phone: "No Telp",
  rsvpStatus: "Status",
  email: "Email",
  createdAt: "Created At",
};

export default function TableList({
  data,
  link,
  detailIdTo,
  display = ["name", "email", "phone", "rsvpStatus"],
}: {
  data: eventWithGuestItem;
  link: string;
  detailIdTo?: string;
  display?: (keyof guestItem)[];
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date-newest" | "date-oldest" | "name-asc">("date-newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalSend, setModalSend] = useState(false);
  const [nameModal, setNameModal] = useState("");
  const [dataModal, setDataModal] = useState<guestItem | null>(null);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const router = useRouter();

// Pindahkan dataList ke dalam useMemo
const processedData = useMemo(() => {
  const dataList: guestItem[] = Array.isArray(data.guests) ? data.guests : [];
  const temp = [...dataList];

  switch (sortBy) {
    case "date-newest":
      temp.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "date-oldest":
      temp.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case "name-asc":
      temp.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return temp.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
}, [data.guests, search, sortBy]);


  const totalPages = Math.ceil(processedData.length / pageSize);
  const displayedData = processedData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {modalSend && dataModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setModalSend(false)}
        >
          <div
            className="w-[450px] rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Send RSVP Invitation</h2>
                <p className="text-sm opacity-90">to {nameModal}</p>
              </div>
              <button onClick={() => setModalSend(false)} className="text-white text-xl font-bold hover:opacity-80">×</button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="border border-green-500 rounded-lg p-4 cursor-pointer hover:bg-green-50 dark:hover:bg-green-800 dark:border-green-600 transition">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faPhoneAlt} className="w-8 h-8 text-green-600" />
                  <p className="font-semibold dark:text-green-400">WhatsApp</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPhone}</p>
                </div>
              </div>

              <div className="border border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-800 transition">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="w-8 h-8 text-blue-600" />
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-gray-600">{selectedEmail}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">Message Preview:</p>
                <div className="bg-gray-100 dark:bg-gray-800 text-sm p-3 rounded-lg border border-gray-300 dark:border-gray-700 whitespace-pre-line">
                  {`Hi ${dataModal.name},

You're invited to ${data.name}!

📅 Date: ${new Date(data.date).toLocaleDateString()}
⏰ Time: ${new Date(data.time).toLocaleTimeString()}
📍 Location: ${data.address}

Please confirm your attendance by clicking the link below:
https://${baseUrl}/events/${detailIdTo}/rsvp?guestId=${dataModal.id}

We look forward to seeing you there!`}
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-2">
                <button
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => {
                    router.push(`${link}/send-invitation?type=whatsapp`);
                    setModalSend(false);
                  }}
                >
                  <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                  Send via WhatsApp
                </button>

                <button
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  onClick={() => {
                    router.push(`${link}/send-invitation?type=email`);
                    setModalSend(false);
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelopeCircleCheck} className="mr-2" />
                  Send via Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-white/5 backdrop-blur-lg shadow-lg rounded-2xl border border-gray-200 dark:border-white/10 p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value as "date-newest" | "date-oldest" | "name-asc")}
  className="bg-white dark:bg-gray-700 text-sm p-2 rounded-md border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white"
>
  <option value="name-asc">Sort: Name A-Z</option>
  <option value="date-newest">Sort: Date Newest Created</option>
  <option value="date-oldest">Sort: Date Oldest Created</option>
</select>


          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-white/10 rounded-md text-gray-800 dark:text-white text-sm"
            placeholder="Search guest by name..."
          />

          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="bg-white dark:bg-gray-700 text-sm p-2 rounded-md border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white"
          >
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={25}>Show 25</option>
            <option value={50}>Show 50</option>
          </select>
        </div>

        <div className="w-full overflow-x-auto md:overflow-visible">
          <table className="min-w-max md:min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-white/10 border-b border-gray-300 dark:border-white/10 text-sm">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">No</th>
                {display.map((key) => <th key={key} className="px-6 py-3 whitespace-nowrap">{columnLabels[key] ?? key}</th>)}
                <th className="px-6 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {displayedData.map((guest, index) => (
                <tr key={guest.id} className="bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition">
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  {display.map((key) => <td key={key} className="px-6 py-4 whitespace-nowrap">{String(guest[key] ?? "-")}</td>)}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {guest.rsvpStatus === "CONFIRMED" ? (
                        <span className="text-green-500 font-semibold">Confirmed</span>
                      ) : guest.rsvpStatus === "WAITING" ? (
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          onClick={() => {
                            setDataModal(guest);
                            setSelectedPhone(guest.phone);
                            setSelectedEmail(guest.email ?? "");
                            setNameModal(guest.name);
                            setModalSend(true);
                          }}
                        >
                          Send
                        </button>
                      ) : (
                        <span className="text-red-500 font-semibold">Cancelled</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
          <span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, processedData.length)} of {processedData.length}</span>
          <div className="flex gap-3">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-gray-300 dark:border-white/10 rounded-md bg-gray-100 dark:bg-white/10 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-white/20 transition">Prev</button>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-gray-300 dark:border-white/10 rounded-md bg-gray-100 dark:bg-white/10 disabled:opacity-40 hover:bg-gray-200 dark:hover:bg-white/20 transition">Next</button>
          </div>
        </div>
      </div>
    </>
  );
}
