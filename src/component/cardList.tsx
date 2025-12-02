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


export default function CardList({ data, link, onDelete }: { data: EventItem[], link: string, onDelete: (id: string) => Promise<void> }) {
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
  <ModalDesign isOpen={modalOpen} onClose={() => setModalOpen(false)} >
    <h2 className="text-lg font-semibold mb-3 mt-3">Are you sure to delete Id {deleteId}?</h2>

    <div className="flex justify-end gap-2">
      <button
        className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-400 cursor-pointer"
        onClick={() => setModalOpen(false)}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
        onClick={async () => {
          await onDelete(deleteId!);
          setModalOpen(false);
        }}
      >
        Confirm
      </button>
    </div>
  </ModalDesign>
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
          <option value={5} className="text-black">Show 5</option>
          <option value={10} className="text-black">Show 10</option>
          <option value={25} className="text-black">Show 25</option>
          <option value={50} className="text-black">Show 50</option>
        </select>
      </div>

      {/* Table Scrollable Area */}
      {/* Card List */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {displayedData.map((event) => (
    <div
      key={event.id}
      className="bg-white/10 rounded-xl p-4 border border-white/10 shadow-md backdrop-blur-md"
    >
      <h3 className="text-lg font-semibold text-white">{event.name}</h3>

      <p className="text-gray-400 text-sm mt-1">
        Venue: <span className="text-white">{event.venueName}</span>
      </p>

      <p className="text-gray-400 text-sm">
        Address: <span className="text-white">{truncateText(event.address, 25)}</span>
      </p>

      <p className="text-gray-400 text-sm">
        Date:{" "}
        <span className="text-white">
          {new Date(event.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      </p>

      <p className="text-gray-400 text-sm">
        Max Pax: <span className="text-white">{event.maxPax}</span>
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          title="View Details"
          className="text-green-400 hover:text-green-300 cursor-pointer"
          onClick={() => {
            router.push(`${link}/${event.id}`);
          }}
        >

          <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
        </button>
        <button
          title="Edit Event"
          onClick={() => {
            router.push(`${link}/${event.id}/edit`);
          }}
          className="text-blue-400 hover:text-blue-300 cursor-pointer"
        >
          <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
        </button>
        <button
          title="Delete Event"
          onClick={() => {
            setDeleteId(event.id);
            setModalOpen(true);
          }}
          className="text-red-400 hover:text-red-300 cursor-pointer"
        >
          <FontAwesomeIcon icon={faTrashCan} className="w-5 h-5" />
        </button>
      </div>
    </div>
  ))}

  {displayedData.length === 0 && (
    <div className="col-span-full text-center text-gray-400 py-6">
      No results found
    </div>
  )}
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
