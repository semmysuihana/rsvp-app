interface ModalDesignProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function ModalDesign({ isOpen, onClose, children, title }: ModalDesignProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[999] p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl w-full max-w-md text-white relative animate-fadeIn">

        {/* TITLE SECTION */}
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
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
