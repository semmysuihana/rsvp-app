"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrashCan,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useMemo } from "react";
import ModalDesign from "./modalDesign";
import { useRouter } from "next/navigation";

interface EventItem {
  id: string;
  name: string;
  venueName: string;
  address: string;
  date: Date;
  maxPax: number;
  createdAt: Date;
}

export default function TableList({ data, link }: { data: EventItem[], link: string }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const processedData = useMemo(() => {
    const temp = [...data];

if (sortBy === "date-newest") {
  temp.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
} else if (sortBy === "date-oldest") {
  temp.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
} else if (sortBy === "name-asc") {
  temp.sort((a, b) => a.name.localeCompare(b.name));
}


    return temp.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search, sortBy]);

  const totalPages = Math.ceil(processedData.length / pageSize);
  const displayedData = processedData.slice((page - 1) * pageSize, page * pageSize);
  function truncateText(text: string, maxLength: number) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }
  return (
    <>
     {modalOpen && (
  <ModalDesign
    setModalOpen={setModalOpen}
    message="Are you sure you want to delete this event?"
    actionSuccess={() => {
      setModalOpen(false);
      router.refresh();
    }}
  />
)}

    <div className="bg-white/5 backdrop-blur-lg shadow-lg rounded-2xl border border-white/10 p-4 space-y-4">
    <div className="flex justify-between gap-4">
            <Link
  href={`${link}/create`}
  className="bg-blue-500 hover:bg-blue-600 text-sm p-2 rounded-md border border-white/10 text-white flex items-center gap-2"
  style={{ textDecoration: "none" }}
>
  <FontAwesomeIcon icon={faPlusCircle} /> Create
</Link>

        </div>
      {/* Filters */}
      
      <div className="flex flex-wrap justify-between gap-4">
        <select
          className="bg-white/10 text-sm p-2 rounded-md border border-white/10 text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name-asc" className="text-black">Sort: Name A-Z</option>
          <option value="date-newest" className="text-black">Sort: Date Newest Created</option>
          <option value="date-oldest" className="text-black">Sort: Date Oldest Created</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="block w-full max-w-64 px-3 py-2 bg-white/10 border border-white/10 rounded-md text-white text-sm"
          placeholder="Search event by name..."
        />

        {/* Page Size Selector */}
        <select
          className="bg-white/10 text-sm p-2 rounded-md border border-white/10 text-white"
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
        >
          <option value={5}>Show 5</option>
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
        </select>
      </div>

      {/* Table Scrollable Area */}
      <div className="overflow-x-auto">
        <table className="min-w-max w-full text-sm text-left text-gray-200">

            
          <thead className="bg-white/10 border-b border-white/10 text-sm">
            <tr>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Venue</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Max Pax</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {displayedData.map((event) => (
              <tr key={event.id} className="bg-white/5 border-b border-white/10">
                <td className="px-6 py-4 font-medium text-white">{event.name}</td>
                <td className="px-6 py-4">{event.venueName}</td>
                <td className="px-6 py-4">{truncateText(event.address, 10)}</td>
                <td className="px-6 py-4">
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">{event.maxPax}</td>
                <td className="px-6 py-4 text-center">
                <button title="Edit Event" className="text-blue-400 hover:underline">
                    <FontAwesomeIcon icon={faEdit} className="w-6 h-6 cursor-pointer" />
                </button>
                <button
                  title="Delete Event"
                  onClick={() => {
                    setDeleteId(event.id);
                    setModalOpen(true);
                  }}
                  className="text-red-400 hover:underline ml-2"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="w-6 h-6 cursor-pointer" />
                </button>
                <button 

                title="View Details" 
                className="text-green-400 hover:underline ml-2
                ">
                    <FontAwesomeIcon icon={faEye} className="w-6 h-6 cursor-pointer" />
                </button>
                </td>

              </tr>
            ))}

            {displayedData.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, processedData.length)} of {processedData.length}
        </span>

        <div className="flex gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border border-white/10 rounded-md bg-white/10 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border border-white/10 rounded-md bg-white/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
