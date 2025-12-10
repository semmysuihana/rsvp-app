"use client";
import { FontAwesomeIcon, FontAwesomeLayers } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrashCan,
  faPlus,
  faPlusCircle,
  faCalendarAlt,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState, useMemo } from "react";
import ModalDesign from "./modalDesign";
import { useRouter } from "next/navigation";
import CardContainer from "./cardContainer";
import { useRef, useEffect } from "react";
import type { DataItem } from "~/types/eventType";


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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const totalResponded = (item: DataItem) =>
  item.capacity.confirmed +
  item.capacity.waiting +
  item.capacity.canceled;

  const percent = (item: DataItem) =>
  Math.round((totalResponded(item) / item.maxPax) * 100);

const menuRef = useRef<HTMLDivElement>(null);
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

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuId(null);
    }
  }
  document.addEventListener("mousedown", handleClickOutside);

  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);


 return (
  <>
    {modalOpen && (
      <div onClick={() => setModalOpen(false)} >
      <ModalDesign isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">
          Delete {name} with name: <span className="text-red-400">{nameModal}</span> ?
        </h2>

        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()} >
          <button
            className="px-4 py-2 bg-gray-300 rounded-md dark:text-gray-900 hover:bg-gray-500 hover:text-white cursor-pointer"
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
      </div>
    )}

    <div className="bg-white dark:bg-white/5 backdrop-blur-lg shadow-lg rounded-2xl border border-gray-200 dark:border-white/10 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">{name} List</h2>

      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="px-3 py-2 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/10 rounded-md text-gray-800 dark:text-white text-sm w-full"
          placeholder={`Search ${name} by name...`}
        />

        <select
          className="bg-gray-100 dark:bg-white/10 text-sm p-2 rounded-md border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name-asc" className="text-black">Sort: Name A-Z</option>
          <option value="date-newest" className="text-black">Newest Created</option>
          <option value="date-oldest" className="text-black">Oldest Created</option>
        </select>

        <select
          className="bg-gray-100 dark:bg-white/10 text-sm p-2 rounded-md border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white"
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
        >
          <option value={5} className="text-black">Show 5</option>
          <option value={10} className="text-black">Show 10</option>
          <option value={25} className="text-black">Show 25</option>
          <option value={50} className="text-black">Show 50</option>
        </select>
      </div>
      {/* legend information */}
      <div className="flex justify-items-start gap-4">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span>Waiting</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>Canceled</span>
        </div>
      </div>
      {/* Card List */}
      <CardContainer cols={3}>
        {displayedData.map((item) => (
  <div
    key={item.id}
    onClick={(e) => e.stopPropagation()}
    className="relative rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 backdrop-blur-xl transition hover:scale-[1.01]"
  >
    {/* Header Color */}
    <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 p-4 text-white">
      <h3 className="font-semibold text-lg">{item.name}</h3>
    </div>

    <div className="p-4 space-y-3">

      {/* Date & Time */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
        <FontAwesomeLayers className="text-base">
          <FontAwesomeIcon icon={faCalendarAlt} />
        </FontAwesomeLayers>
        <span>{formatValue(item.date, "date")} - {formatValue(item.time, "time")}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
        <FontAwesomeLayers className="text-base">
          <FontAwesomeIcon icon={faLocationDot} />
        </FontAwesomeLayers>
        <span>{item.address}</span>
      </div>

      {/* Capacity Progress */}
  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300 mb-1">
    <span>Capacity</span>
    <span className="text-gray-800 dark:text-white">
      {totalResponded(item)} / {item.maxPax}
    </span>
  </div>

  {/* Progress Bar Wrapper */}
  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/20 flex overflow-hidden">

    {/* Confirmed */}
    <div
      className="h-2 bg-green-400"
      style={{
        width: `${(item.capacity.confirmed / item.maxPax) * 100}%`,
      }}
    />

    {/* Waiting */}
    <div
      className="h-2 bg-yellow-400"
      style={{
        width: `${(item.capacity.waiting / item.maxPax) * 100}%`,
      }}
    />

    {/* Canceled */}
    <div
      className="h-2 bg-red-400"
      style={{
        width: `${(item.capacity.canceled / item.maxPax) * 100}%`,
      }}
    />
  </div>

  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
    {percent(item)}% Responded
  </p>

      {/* Status Buttons
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1 rounded-md text-xs bg-green-600/80 hover:bg-green-600 text-white font-medium">
          CONFIRM
        </button>
        <button className="px-3 py-1 rounded-md text-xs bg-yellow-500/50 hover:bg-yellow-500/70 text-white font-medium">
          WAITING
        </button>
        <button className="px-3 py-1 rounded-md text-xs bg-red-600/40 hover:bg-red-600/60 text-white font-medium">
          CANCEL
        </button>
      </div> */}
    </div>

    {/* Action Menu */}
<div className="absolute top-3 right-3">

  {/* Button titik tiga */}
  <button
    onClick={(e) => {
      setOpenMenuId(openMenuId === item.id ? null : item.id);
    }}
    className="text-white hover:text-gray-200 p-1"
  >
    <span className="text-xl font-bold">⋮</span>
  </button>

  {/* Dropdown menu */}
  {openMenuId === item.id && (
    <div ref={menuRef} className="absolute right-0 mt-2 bg-white text-black dark:text-white dark:bg-gray-800 rounded-lg shadow-xl w-32 py-2 z-50"
    onClick={(e) => e.stopPropagation()} >
      <button
        onClick={(e) => {
          router.push(`${link}/${item.id}`)}}
        className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      >
        Details
      </button>

      <button
        onClick={(e) => {
          router.push(`${link}/${item.id}/edit`)}}
        className="block w-full px-4 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      >
        Edit
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setDeleteId(item.id);
          setModalOpen(true);
          setNameModal(item.name);
          setOpenMenuId(null);
        }}
        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
      >
        Delete
      </button>
    </div>
  )}
</div>


  </div>
))}

      </CardContainer>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
        <span>
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, processedData.length)} of {processedData.length}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1 rounded-md bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/10 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1 rounded-md bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/10 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </>
);

}
