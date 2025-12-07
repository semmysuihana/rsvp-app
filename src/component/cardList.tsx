"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrashCan,
  faPlus,
  faPlusCircle
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useMemo } from "react";
import ModalDesign from "./modalDesign";
import { useRouter } from "next/navigation";
import CardContainer from "./cardContainer";
interface DataItem {
  id: string;
  name: string;
  createdAt: Date;
  [key: string]: string | number | Date | null | undefined;
}

 type FieldValue = string | number | Date | null | undefined;


export default function CardList({name, data, link, onDelete, detailIdTo, display }: { name: string, data: DataItem[], link: string, onDelete: (id: string) => Promise<void>, detailIdTo?: string, display?: string[] }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [nameModal, setNameModal] = useState("");
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


 function formatValue(value: FieldValue, field: string): string {
  if (value == null) return "-";

  if (field === "date") {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  if (field === "time") {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  }

  if (typeof value === "string") return truncateText(value, 20);

  return value.toString();
}


 return (
  <>
    {modalOpen && (
      <ModalDesign isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">
          Delete {name} with name: <span className="text-red-400">{nameModal}</span> ?
        </h2>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 cursor-pointer"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer"
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

    <div className="bg-white/5 backdrop-blur-lg shadow-lg rounded-2xl border border-white/10 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white capitalize">{name} List</h2>

        <Link
          href={`${link}/create`}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 shadow-md"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="w-4 h-4" />
          Create New
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-white/10 border border-white/10 rounded-md text-white text-sm w-full"
          placeholder={`Search ${name} by name...`}
        />

        <select
          className="bg-white/10 text-sm p-2 rounded-md border border-white/10 text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name-asc" className="text-black">Sort: Name A-Z</option>
          <option value="date-newest" className="text-black">Newest Created</option>
          <option value="date-oldest" className="text-black">Oldest Created</option>
        </select>

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

      {/* Card List */}
      <CardContainer cols={2}>
        {displayedData.map((item) => (
          <div
            key={item.id}
            className="relative bg-white/10 rounded-xl p-4 border border-white/10 shadow-lg backdrop-blur-md transition hover:shadow-2xl hover:scale-[1.01]"
          >
            {/* Action Buttons Top-Right */}
            <div className="absolute top-3 right-3 flex gap-3 opacity-80">
              {detailIdTo && (
                <button
                  title="Add"
                  onClick={() => router.push(`${link}/${item.id}/${detailIdTo}`)}
                  className="text-green-400 hover:text-green-300"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              )}
              <button title="Details" onClick={() => router.push(`${link}/${item.id}`)} className="text-white hover:text-gray-300">
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button title="Edit" onClick={() => router.push(`${link}/${item.id}/edit`)} className="text-blue-400 hover:text-blue-300">
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                title="Delete"
                onClick={() => { 
                  setDeleteId(item.id); 
                  setModalOpen(true);
                  setNameModal(item.name);
                }}
                className="text-red-400 hover:text-red-300"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>

            {/* Display Fields */}
            {display?.map((field) => (
              <p className="text-gray-300 text-sm mt-1" key={field}>
                <span className="capitalize">{field.replace(/([A-Z])/g, " $1")}: </span>
                <span className="text-white">{formatValue(item[field], field)}</span>
              </p>
            ))}
          </div>
        ))}
      </CardContainer>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, processedData.length)} of {processedData.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1 rounded-md bg-white/10 border border-white/10 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1 rounded-md bg-white/10 border border-white/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </>
);

}
