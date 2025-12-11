"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCalendarDays,
  faUsers,
  faChartBar,
  faRightFromBracket,
  faBars,
  faXmark,
  faReceipt,
  faPlus,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import ModalDesign from "~/component/modalDesign";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);
  const [lang, setLang] = useState<'ENG' | 'INA'>('ENG');
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "User";
  return (
    <>
      {/* Logout Modal */}
      {modalLogout && (
        <ModalDesign
          isOpen={modalLogout}
          title="Logout Confirmation"
          onClose={() => setModalLogout(false)}
        >
          <h2 className="text-lg font-semibold mb-3">Are you sure to logout?</h2>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-400"
              onClick={() => setModalLogout(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              onClick={() => signOut()}
            >
              Confirm
            </button>
          </div>
        </ModalDesign>
      )}

      {/* TOP BAR */}
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 z-50
        flex items-center justify-between px-4 md:px-6 py-3 
        text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 shadow-md">

        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            <FontAwesomeIcon icon={faReceipt} className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">RSVP Manager</span>
        </div>
      {/* Language Switcher */}
<div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
  
  <button
    onClick={() => setLang('ENG')}
    className={`px-3 py-1.5 text-sm flex items-center gap-1
      ${lang === 'ENG'
        ? "text-indigo-600 font-semibold bg-indigo-100 dark:text-indigo-50 dark:bg-indigo-900"
        : "text-gray-600 dark:text-gray-300"
      }`}
  >
    <FontAwesomeIcon icon={faLanguage} className="w-4 h-4" />
    ENG
  </button>

  <button
    onClick={() => setLang('INA')}
    className={`px-3 py-1.5 text-sm flex items-center gap-1
      ${lang === 'INA'
        ? "text-indigo-600 font-semibold bg-indigo-100 dark:text-indigo-50 dark:bg-indigo-900"
        : "text-gray-600 dark:text-gray-300"
      }`}
  >
    <FontAwesomeIcon icon={faLanguage} className="w-4 h-4" />
    INA
  </button>
</div>

        {/* Right Section (User + Logout) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium hidden sm:block">Hi, {userName}</span>
          </div>

          <button
            onClick={() => setModalLogout(true)}
            className="text-red-600 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Overlay Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 w-60 h-full bg-white dark:bg-gray-800 
        text-gray-800 dark:text-gray-200 flex flex-col shadow-xl z-40
        transform transition-transform duration-300 pt-14
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 md:hidden">
          <span className="text-xl font-bold">Menu</span>
          <button onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
          </button>
        </div>

        {/* Menu List */}
        <MenuList />
      </div>
    </>
  );
}

function MenuList() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      <MenuItem icon={faHome} label="Beranda" href="/dashboard" active={pathname === "/dashboard"} />
      <MenuItem icon={faPlus} label="Buat Acara" href="/events/create" active={pathname === "/events/create"} />
      <MenuItem icon={faCalendarDays} label="Events" href="/events" active={pathname === "/events"} />
      <MenuItem icon={faUsers} label="Profile" href="/profile" active={pathname === "/profile"} />
      <MenuItem icon={faChartBar} label="Statistics" href="/statistics" active={pathname === "/statistics"} />
      <MenuItem icon={faReceipt} label="Subscription Plan" href="/plan" active={pathname === "/plan"} />
    </nav>
  );
}

function MenuItem({ icon, label, href, active }: { icon: IconProp; label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium
      ${active
        ? "bg-indigo-50 dark:bg-indigo-600 text-indigo-600 dark:text-indigo-50"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      {label}
    </a>
  );
}
