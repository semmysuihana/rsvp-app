
interface ModalDesignProps {
  setModalOpen: (value: boolean) => void;
  actionSuccess: () => void;
  message: string;
}

export default function ModalDesign({ setModalOpen, actionSuccess, message }: ModalDesignProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
      <div className="bg-gray-800 p-5 rounded-md shadow-md w-72 text-white">
        <h2 className="text-lg font-semibold mb-3">Are you sure?</h2>
        <p className="mb-4">{message}</p>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-500 rounded-md hover:bg-gray-400 cursor-pointer"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
            onClick={actionSuccess}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
