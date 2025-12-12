"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

export default function useRsvpGuest(guestId: string | null, token: string | null) {
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: guestData, isLoading, error, refetch } = api.guest.getByIdAndToken.useQuery(
    {
      guestId: guestId ?? "",
      token: token ?? "",
    },
    {
      enabled: !!guestId && !!token,
      retry: false,
    }
  );

  const updateStatus = api.guest.updateRsvpStatus.useMutation({
    onSuccess: () => {
      setAlert({ type: "success", message: "RSVP status updated successfully!" });
      void refetch();
      setTimeout(() => setAlert(null), 3000);
    },
    onError: (err) => {
      setAlert({ type: "error", message: err.message || "Failed to update RSVP status" });
      setTimeout(() => setAlert(null), 3000);
    },
  });

  const handleUpdateStatus = (rsvpStatus: "CONFIRMED" | "CANCELLED") => {
    if (!guestId || !token) return;
    updateStatus.mutate({ guestId, token, rsvpStatus });
  };

  return {
    guestData,
    isLoading,
    error,
    alert,
    handleUpdateStatus,
    isUpdating: updateStatus.isPending,
  };
}
