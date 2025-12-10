import { useState } from "react";

type GuestRow = {
  name: string;
  phone: string;
  email: string;
  pax: number;
  maxSend: number;
};

export default function ModalGuestTable({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (guests: GuestRow[]) => void;
}) {
  const [rows, setRows] = useState<GuestRow[]>([
    { name: "", phone: "", email: "", pax: 1, maxSend: 1 },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      { name: "", phone: "", email: "", pax: 1, maxSend: 1 },
    ]);
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

 const updateRow = <K extends keyof GuestRow>(
  index: number,
  field: K,
  value: GuestRow[K]
) => {
  setRows((prev) => {
    const updated = [...prev];
    if (!updated[index]) return prev;
    updated[index][field] = value;
    return updated;
  });
};


  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-4xl border border-gray-300 dark:border-white/10 animate-fadeIn">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-2">Add Guests</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Masukkan data tamu di dalam tabel berikut.  
          <span className="font-medium block mt-1">
            Legend:
          </span>

          <div className="mt-2 text-xs space-y-1">
            <p><span className="font-semibold">Name</span> — Nama tamu</p>
            <p><span className="font-semibold">Phone</span> — Nomor WhatsApp</p>
            <p><span className="font-semibold">Email</span> — Opsional (jika ingin kirim via email)</p>
            <p><span className="font-semibold">Pax</span> — Jumlah orang yang hadir</p>
            <p><span className="font-semibold">Max Send</span> — Limit pengiriman undangan</p>
          </div>
        </p>

        {/* TABLE INPUT */}
        <div className="overflow-x-auto max-h-[350px] rounded-lg border border-gray-300 dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
              <tr className="text-left">
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Phone</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border w-20">Pax</th>
                <th className="px-4 py-3 border w-24">Max Send</th>
                <th className="px-4 py-3 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="odd:bg-gray-50 dark:odd:bg-gray-800">
                  
                  <td className="border px-3 py-2">
                    <input
                      className="w-full bg-transparent outline-none"
                      placeholder="John Doe"
                      value={row.name}
                      onChange={(e) => updateRow(index, "name", e.target.value)}
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-full bg-transparent outline-none"
                      placeholder="08123456789"
                      value={row.phone}
                      onChange={(e) => updateRow(index, "phone", e.target.value)}
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-full bg-transparent outline-none"
                      placeholder="example@mail.com"
                      value={row.email}
                      onChange={(e) => updateRow(index, "email", e.target.value)}
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      className="w-full bg-transparent outline-none"
                      value={row.pax}
                      min={1}
                      onChange={(e) =>
                        updateRow(index, "pax", Number(e.target.value))
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      type="number"
                      className="w-full bg-transparent outline-none"
                      value={row.maxSend}
                      min={1}
                      onChange={(e) =>
                        updateRow(index, "maxSend", Number(e.target.value))
                      }
                    />
                  </td>

                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => deleteRow(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row */}
        <button
          onClick={addRow}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Row
        </button>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(rows);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save All
          </button>
        </div>
      </div>
    </div>
  );
}
