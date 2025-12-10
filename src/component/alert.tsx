"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning, faCircleXmark, faCheck  } from "@fortawesome/free-solid-svg-icons";

interface AlertProps {
  alert: { type: string; message: string } | null;
  setShowAlert: (show: boolean) => void;
  duration?: number;
}

export default function Alert({ alert, setShowAlert, duration = 4000 }: AlertProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setShowAlert(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, setShowAlert]);

  if (!show) return null;

  const baseStyle =
    "rounded-md p-4 mb-2 flex items-start justify-between gap-3 text-white";

  const bg =
    alert?.type === "success"
      ? "bg-green-500"
      : alert?.type === "error"
      ? "bg-red-500"
      : alert?.type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-500";

return (
  <div
    className={`${baseStyle} ${bg} fixed top-4 right-4 z-50 shadow-lg w-fit`}
  >
    <span>
      <FontAwesomeIcon
        icon={
          alert?.type === "success"
            ? faCheck
            : alert?.type === "error"
            ? faCircleXmark
            : faWarning
        }
      />
    </span>
    <span className="flex-1">{alert?.message}</span>
    <button
      onClick={() => setShowAlert(false)}
      className="text-white font-bold px-2 hover:opacity-80"
    >
      ✕
    </button>
  </div>
);

}
