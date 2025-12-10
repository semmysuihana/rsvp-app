import { useEffect, useRef } from "react";

interface ModalDesignProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function ModalDesign({ isOpen, onClose, children, title }: ModalDesignProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // CLOSE ketika klik di luar modal
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[999] p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md
                   text-white relative animate-fadeIn max-h-[90vh] flex flex-col"
      >

        {/* HEADER */}
        {title && (
          <div className="border-b border-gray-700 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-wide">{title}</h2>

            <button
              className="p-1 rounded hover:bg-gray-700 transition"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}

        {/* CONTENT */}
        <div className="px-6 py-5 text-gray-900 dark:text-gray-200 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
