"use client";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { signOut } from "next-auth/react";
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
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ModalDesign from "~/component/modalDesign";
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);

  const { data: session } = useSession();
  const userName = session?.user?.name ?? "Guest";

  return (
    <>
     {/* Logout Modal */}
      {modalLogout && <ModalDesign setModalOpen={setModalLogout} actionSuccess={() => signOut()} message={"Are you sure you want to logout?"} />}
      {/* Mobile top bar */}
      <div className="bg-gray-800 md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between text-white px-4 py-3 shadow">
        <div className="font-semibold text-lg">RSVP Event</div>
        <button onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faBars} className="w-6 h-6 cursor-pointer" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
  className={`fixed top-0 left-0 w-60 h-full bg-gray-800 text-gray-200 flex flex-col shadow-xl z-50
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0 md:fixed`}
>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 md:hidden">
          <span className="text-xl font-bold">RSVP Event</span>
          <button onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="hidden md:block px-6 pt-6 pb-4">
          <h1 className="text-xl font-bold tracking-wide">RSVP Event</h1>
        </div>
        {/* User Info */}
        <div className="px-6 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Welcome,</p>
              <p className="text-indigo-300 font-medium">{userName}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <MenuList />

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-700">
          <button
            onClick={() => setModalLogout(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 transition text-white font-semibold cursor-pointer"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

function MenuList() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      <MenuItem icon={faHome} label="Dashboard" href="/dashboard" active={pathname === "/dashboard"} />
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
      ${active ? "bg-indigo-600 text-white font-semibold" : "hover:bg-gray-700"}`}
    >
      <FontAwesomeIcon icon={icon} className="w-5 h-5" />
      {label}
    </a>
  );
}
